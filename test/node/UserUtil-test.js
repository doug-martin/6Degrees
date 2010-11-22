var vows = require('vows'),
        assert = require('assert'),
        userUtil = require('../../src/node/util/UserUtil').UserUtil,
        dojo = require('../../src/node/lib/dojo');

var UserUtil = new userUtil({url : 'mongodb://localhost/degreesTest'});

var suite = vows.describe('UserUtil');


suite.addBatch({
    'should create a user': {    // Vow
        topic : function() {
            var user = {
                dateOfBirth : new Date,
                password : "123ABC",
                sex : "male",
                name : "John Doe",
                email : "test@test.com",
                verified : false,
                created : true
            };
            UserUtil.createUser(user, this.callback);
        },

        "look up a user by id" : {
            topic : function(user) {
                UserUtil.findById(user._id, dojo.hitch(this, function(userTwo) {
                    assert.isNotNull(userTwo);
                    assert.isNotNull(userTwo._id);
                    assert.equal('male', userTwo.sex);
                    assert.equal('John Doe', userTwo.name);
                    assert.equal('test@test.com', userTwo.email);
                    assert.isFalse(userTwo.verified);
                    assert.isTrue(userTwo.created);
                    this.callback(user);
                }));
            },

            "remove a user" : {
                topic: function(user) {
                    UserUtil.removeUser(user._id, dojo.partial(this.callback, user));
                },

                "return null for a user that does not exist" : {
                    topic : function(err, res, user) {
                        UserUtil.findById(user._id, this.callback);
                    },

                    "user should be null" : function(user) {
                        assert.isNull(user);
                    }
                }
            }
        }

    },

    "should create user and add friends" : {
        topic : function() {
            var user1Json = {
                dateOfBirth : new Date,
                password : "123ABC",
                sex : "female",
                name : "Friend 1",
                email : "test1@test.com",
                verified : false,
                created : true
            };
            var user2Json = {
                dateOfBirth : new Date,
                password : "123ABC",
                sex : "male",
                name : "Friend 2",
                email : "test2@test.com",
                verified : false,
                created : true
            };
            UserUtil.createUser(user1Json, dojo.hitch(this, function(user1) {
                UserUtil.createUser(user2Json, dojo.hitch(this, function(user2) {
                    this.callback([user1, user2]);
                }));
            }));
        },

        "should add friends" : {
            topic : function(users) {
                assert.length(users, 2);
                var user1 = users[0], user2 = users[1];
                UserUtil.addFriend(user1._id, user2._id, dojo.hitch(this, function(user) {
                    this.callback([user, user2]);
                }));
            },

            "should have added friend" : function(users) {
                assert.length(users, 2);
                var user1 = users[0], user2 = users[1];
                assert.isTrue(user1.containsFriend(user2._id));
            }
        }

    },

    "Should verify a user" : {
        topic : function() {
            var user = {
                dateOfBirth : new Date,
                password : "123ABC",
                sex : "female",
                name : "Friend 1",
                email : "test1@test.com",
                verified : false,
                created : true
            };
            UserUtil.createUser(user, this.callback);
        },

        "should return a user if the password and email are correct" : {
            topic : function() {
                UserUtil.verifyUser("test1@test.com", '123ABC', this.callback);
            },

            "" : function(user) {
                assert.isNotNull(user);
            }
        },

        "should return null if the email is incorrect" : {
            topic : function() {
                UserUtil.verifyUser("t@test.com", "123ABC", this.callback);
            },

            "" : function(user) {
                assert.isNull(user);
            }
        },

        "should return null if both password and email are incorrect" : {
            topic : function() {
                UserUtil.verifyUser("t@test.com", "", this.callback)
            },

            "" : function(user) {
                assert.isNull(user);
            }
        }

    },

    "Should find a connection between friends" : {

        topic : function() {
            var self = this;
            var user1Json = {dateOfBirth : new Date,password : "123ABC",sex : "female",name : "Friend 1",email : "test1@test.com",verified : false,created : true};
            var user2Json = {dateOfBirth : new Date,password : "123ABC",sex : "male",name : "Friend 2",email : "test2@test.com",verified : false,created : true};
            var user3Json = {dateOfBirth : new Date,password : "123ABC",sex : "female",name : "Friend 1",email : "test1@test.com",verified : false,created : true};
            var user4Json = {dateOfBirth : new Date,password : "123ABC",sex : "male",name : "Friend 2",email : "test2@test.com",verified : false,created : true};
            var user5Json = {dateOfBirth : new Date,password : "123ABC",sex : "female",name : "Friend 1",email : "test1@test.com",verified : false,created : true};
            var user6Json = {dateOfBirth : new Date,password : "123ABC",sex : "male",name : "Friend 2",email : "test2@test.com",verified : false,created : true};
            var user7Json = {dateOfBirth : new Date,password : "123ABC",sex : "female",name : "Friend 1",email : "test1@test.com",verified : false,created : true};
            var user8Json = {dateOfBirth : new Date,password : "123ABC",sex : "male",name : "Friend 2",email : "test2@test.com",verified : false,created : true};
            var user9Json = {dateOfBirth : new Date,password : "123ABC",sex : "female",name : "Friend 1",email : "test1@test.com",verified : false,created : true};
            var user10Json = {dateOfBirth : new Date,password : "123ABC",sex : "male",name : "Friend 2",email : "test2@test.com",verified : false,created : true};
            var ids = [];
            UserUtil.createUser(user1Json, function(user1) {
                ids.push(user1._id.toJSON());
                UserUtil.createUser(user2Json, function(user2) {
                    ids.push(user2._id.toJSON());
                    UserUtil.addFriend(user1._id, user2._id, function() {
                        UserUtil.createUser(user3Json, function(user3) {
                            ids.push(user3._id.toJSON());
                            UserUtil.addFriend(user2._id, user3._id, function() {
                                UserUtil.createUser(user4Json, function(user4) {
                                    ids.push(user4._id.toJSON());
                                    UserUtil.addFriend(user3._id, user4._id, function() {
                                        UserUtil.createUser(user5Json, function(user5) {
                                            ids.push(user5._id.toJSON());
                                            UserUtil.addFriend(user4._id, user5._id, function() {
                                                UserUtil.createUser(user6Json, function(user6) {
                                                    ids.push(user6._id.toJSON());
                                                    UserUtil.addFriend(user5._id, user6._id, function() {
                                                        UserUtil.createUser(user7Json, function(user7) {
                                                            ids.push(user7._id.toJSON());
                                                            UserUtil.addFriend(user6._id, user7._id, function() {
                                                                UserUtil.createUser(user8Json, function(user8) {
                                                                    ids.push(user8._id.toJSON());
                                                                    UserUtil.addFriend(user7._id, user8._id, function() {
                                                                        UserUtil.createUser(user9Json, function(user9) {
                                                                            ids.push(user9._id.toJSON());
                                                                            UserUtil.addFriend(user8._id, user9._id, function() {
                                                                                UserUtil.createUser(user10Json, function(user10) {
                                                                                    ids.push(user10._id.toJSON());
                                                                                    UserUtil.addFriend(user9._id, user10._id);
                                                                                    UserUtil.addFriend(user2._id, user10._id);
                                                                                    self.callback(ids);
                                                                                });
                                                                            });

                                                                        });
                                                                    });

                                                                });
                                                            });

                                                        });
                                                    });

                                                });
                                            });

                                        });
                                    });

                                });
                            });

                        });
                    });
                });
            });
        },

        "should find a connection from first user to second user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[1];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 2);
                var res1 = results[0], res2 = results[1];
                var seeker = users[0], target = users[1];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to third user" : {
            topic : function(users) {                
                assert.length(users, 10);
                var seeker = users[0], target = users[2];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 3);
                var res1 = results[0], res2 = results[2];
                var seeker = users[0], target = users[2];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to fourth user" : {
            topic : function(users) {
                console.log(2);
                assert.length(users, 10);
                var seeker = users[0], target = users[3];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 4);
                var res1 = results[0], res2 = results[3];
                var seeker = users[0], target = users[3];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to fifth user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[4];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 5);
                var res1 = results[0], res2 = results[4];
                var seeker = users[0], target = users[4];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to sixth user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[5];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 6);
                var res1 = results[0], res2 = results[5];
                var seeker = users[0], target = users[5];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to seventh user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[6];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 7);
                var res1 = results[0], res2 = results[6];
                var seeker = users[0], target = users[6];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should find a connection from first user to eighth user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[7];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 8);
                var res1 = results[0], res2 = results[7];
                var seeker = users[0], target = users[7];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        },

        "should not a connection from first user to nineth user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[8];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.isNull(results);                
            }
        },

        "should find a connection from first user to tenth user" : {
            topic : function(users) {
                assert.length(users, 10);
                var seeker = users[0], target = users[9];
                UserUtil.sixDegrees(seeker, target, dojo.partial(this.callback, users));
            },

            "" : function(users, results) {
                assert.length(results, 3);
                var res1 = results[0], res2 = results[2];
                var seeker = users[0], target = users[9];
                assert.equal(res1.id, seeker);
                assert.equal(res2.id, target);
            }
        }
    }
}).export(module, {error: false});