var soda = require('soda'),
    userUtil = require('../../src/node/util/UserUtil').UserUtil,
    assert = require('assert');

var browser = soda.createClient({
    host: 'localhost'
    , port: 4444
    , url: 'http://dougamartin.com:8088/'
    , browser: 'firefox'
});

var UserUtil = new userUtil();
var user1 = {
    dateOfBirth : new Date,
    password : "123ABC",
    sex : "male",
    name : "John Doe",
    email : "test1@test.com",
    verified : false,
    created : true
};
var user2 = {
    dateOfBirth : new Date,
    password : "123ABC",
    sex : "male",
    name : "John Doee",
    email : "test2@test.com",
    verified : false,
    created : true
};
var user3 = {
    dateOfBirth : new Date,
    password : "123ABC",
    sex : "female",
    name : "Jane Doe",
    email : "test3@test.com",
    verified : false,
    created : true
};
var user4 = {
    dateOfBirth : new Date,
    password : "123ABC",
    sex : "female",
    name : "Jane Doee",
    email : "test4@test.com",
    verified : false,
    created : true
};

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

getStringDate = function(date){
    var month = months[date.getMonth()];
    var day = date.getDate() + 1;
    var year = date.getFullYear().toString().substr(2);
    return month + " " + day + " " + year;
}


createTestData = function() {
    console.log("Creating test data");
    UserUtil.createUser(user1, function(usr1) {
        user1.id = usr1._id;
        UserUtil.createUser(user2, function(usr2) {
            user2.id = usr2._id;
            UserUtil.createUser(user3, function(usr3) {
                user3.id = usr3._id;
                UserUtil.createUser(user4, function(usr4) {
                    user4.id = usr4._id;
                    UserUtil.addFriend(user1.id, user2.id);
                    UserUtil.addFriend(user2.id, user3.id);
                    UserUtil.addFriend(user3.id, user4.id);
                    UserUtil.addMessage(user2.id, user1.id, "Hello");
                    UserUtil.addMessage(user1.id, user2.id, "Hello");
                    UserUtil.addMessage(user1.id, user3.id, "Hello");
                    UserUtil.addMessage(user1.id, user4.id, "Hello");
                    console.log("Created test data");
                });
            });

        });

    });
}

dropTestData = function(){
    console.log("Removing test data");
    UserUtil.removeUser(user1.id);
    UserUtil.removeUser(user2.id);
    UserUtil.removeUser(user3.id);
    UserUtil.removeUser(user4.id);
    console.log("Removed test data");
}

checkPresence = function(element, input, text, button) {
    return function(browser) {
        if (element && input) {
            browser.type(element, input);
        }
        if (button) browser.click(button)
        browser.verifyTextPresent(text)
    }
}

checkLoginValidations = function() {
    return function(browser) {
        browser
                .open('/6Degrees/')
                .verifyTitle('Login')
                .waitForElementPresent('degrees_Logon_0')
                .and(checkPresence('dijit_form_ValidationTextBox_0', '', "This value is required.", 'dijit_form_Button_0'))
                .and(checkPresence('dijit_form_ValidationTextBox_0', '1', "Invalid Email Address", 'dijit_form_Button_0'))
                .and(checkPresence('dijit_form_ValidationTextBox_0', '1@1.com', "This value is required.", 'dijit_form_Button_0'))
                .and(checkPresence('dijit_form_ValidationTextBox_1', '1', "Invalid Username and Password", 'dijit_form_Button_0'));
    }
}

checkCreateValidations = function() {
    return function(browser) {
        browser
                .open('/6Degrees/')
                .waitForElementPresent('degrees_Logon_0')
                .click('link=Create Account')
                .and(checkPresence('', '', 'This value is required', 'dijit_form_Button_1'))
                .and(checkPresence('dijit_form_ValidationTextBox_2', '1', "Invalid Email Address", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_2', '1@1.com', "This value is required.", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_3', '1@1.edu', "Email does not match!", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_3', '1@1.com', "This value is required.", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_4', '', "This value is required.", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_4', '123', "This value is required.", 'dijit_form_Button_2'))
                .and(checkPresence('dijit_form_ValidationTextBox_5', '12', "Password does not match!", 'dijit_form_Button_2'));
    }
}

login = function(user) {
    return function(browser) {
        browser
                .open('/6Degrees/')
                .verifyTitle('Login')
                .waitForElementPresent('degrees_Logon_0')
                .type('dijit_form_ValidationTextBox_0', user.email)
                .type('dijit_form_ValidationTextBox_1', user.password)
                .clickAndWait('dijit_form_Button_0')
                .verifyTitle('Home')

    }
}

logout = function() {
    return function(browser) {
        browser
                .open('/6Degrees/')
                .verifyTitle('Home')
                .waitForElementPresent('degrees_Logon_0')
                .clickAndWait("//div[@id='degrees_user_layout_Container_0']/div[1]/div[2]/span[2]")
                .verifyTitle('Login')
    }
}

checkUserInfoIsPresent = function(user) {
    return function(browser) {
        browser
                .and(login(user))
                .verifyTitle('Home')
                .verifyText("dijit_form_Button_1_label", 'Profile')
                .verifyText("dijit_form_Button_2_label", 'Find Connection')
                .verifyText("//div[@id='degrees_user_Profile_0']/div[2]/div[1]", user.name)
                .verifyText("//div[@id='degrees_user_Profile_0']/div[2]/table[1]/tbody/tr/td/table/tbody/tr[1]/td[2]", user.email)
                .verifyText("//div[@id='degrees_user_Profile_0']/div[2]/table[1]/tbody/tr/td/table/tbody/tr[2]/td[2]", user.sex)
                .verifyText("//div[@id='degrees_user_Profile_0']/div[2]/table[1]/tbody/tr/td/table/tbody/tr[3]/td[2]", getStringDate(user.dateOfBirth))
                .verifyText("//tr[@id='degrees_user_Message_0']/td[2]", 'Hello')
                .clickAndWait("//div[@id='degrees_user_layout_Container_0']/div[1]/div[2]/span[2]")
    }
}

createTestData();
//Check For Login Validations
browser
        .chain
        .session()        
        .and(checkLoginValidations())
        .and(checkCreateValidations())
        .and(login(user1))
        .and(logout())
        .and(login(user2))
        .and(logout())
        .and(login(user3))
        .and(logout())
        .and(login(user4))
        .and(logout())
        .and(checkUserInfoIsPresent(user1))
        .and(checkUserInfoIsPresent(user2))
        .and(checkUserInfoIsPresent(user3))
        .and(checkUserInfoIsPresent(user4))
        .testComplete()
        .end(function(err) {
            dropTestData();
            if (err) throw err;
            console.log('done');
        });