// this file is located at:
//
//      <server root>/js/src/mylayer.profile.js
//
// This profile is used just to illustrate the layout of a layered build.
// All layers have an implicit dependency on dojo.js.
//
// Normally you should not specify a layer object for dojo.js, as it will
// be built by default with the right options. Custom dojo.js files are
// possible, but not recommended for most apps.

dependencies = {
    layers: [
        {
            // This layer will be discarded, it is just used
            // to specify some modules that should not be included
            // in a later layer, but something that should not be
            // saved as an actual layer output. The important property
            // is the "discard" property. If set to true, then the layer
            // will not be a saved layer in the release directory.
            name: "acme.discard",
            resourceName: "acme.discard",
            discard: true,           
            dependencies: [
                "dojo.string"
            ]
        },
        {
            // one of the stock layers. It builds a "roll up" for
            // dijit.dijit which includes most of the infrastructure needed to
            // build widgets in a single file. We explicitly ignore the string
            // stuff via the previous exclude layer.

            // where the output file goes, relative to the dojo dir
            name: "../dijit/dijit.js",
            // what the module's name will be, i.e., what gets generated
            // for dojo.provide(<name here>);
            resourceName: "dijit.dijit",
            // modules not to include code for
            layerDependencies: [
                "string.discard"
            ],
            // modules to use as the "source" for this layer
            dependencies: [
                "dijit.dijit"
            ]
        },
            {
            // where to put the output relative to the Dojo root in a build
            name: "../degrees/degrees.js",
            // what to name it (redundant w/ or example layer)
            resourceName: "degrees.degrees",
            // what other layers to assume will have already been loaded
            // specifying modules here prevents them from being included in
            // this layer's output file
            layerDependencies: [
            ],
            // which modules to pull in. All of the depedencies not
            // provided by dojo.js or other items in the "layerDependencies"
            // array are also included.
            dependencies: [
                // our acme.mylayer specifies all the stuff our app will
                // need, so we don't need to list them all out here.
                "degrees.degrees"
            ]
        },
        {
            // where to put the output relative to the Dojo root in a build
            name: "../degrees/logonLayer.js",
            // what to name it (redundant w/ or example layer)
            resourceName: "degrees.logonLayer",
            // what other layers to assume will have already been loaded
            // specifying modules here prevents them from being included in
            // this layer's output file
            layerDependencies: [                
            ],
            // which modules to pull in. All of the depedencies not
            // provided by dojo.js or other items in the "layerDependencies"
            // array are also included.
            dependencies: [
                // our acme.mylayer specifies all the stuff our app will
                // need, so we don't need to list them all out here.
                "degrees.logonLayer"
            ]
        },
        {
            // where to put the output relative to the Dojo root in a build
            name: "../degrees/userLayer.js",
            // what to name it (redundant w/ or example layer)
            resourceName: "degrees.userLayer",
            // what other layers to assume will have already been loaded
            // specifying modules here prevents them from being included in
            // this layer's output file
            layerDependencies: [
            ],
            // which modules to pull in. All of the depedencies not
            // provided by dojo.js or other items in the "layerDependencies"
            // array are also included.
            dependencies: [
                // our acme.mylayer specifies all the stuff our app will
                // need, so we don't need to list them all out here.
                "degrees.userLayer"
            ]
        }
    ],

    prefixes: [
        // the system knows where to find the "dojo/" directory, but we
        // need to tell it about everything else. Directories listed here
        // are, at a minimum, copied to the build directory.
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "degrees", "../../degrees" ]
    ]
}

// If you choose to optimize the JS files in a prefix directory (via the
// optimize= build parameter), you can choose to have a custom copyright
// text prepended to the optimized file. To do this, specify the path to a
// file tha contains the copyright info as the third array item in the
// prefixes array. For instance:
//      prefixes: [
//              [ "acme", "/path/to/acme", "/path/to/acme/copyright.txt"]
//      ]
//
// NOTE:
//    If no copyright is specified in this optimize case, then by default,
//    the Dojo copyright will be used.