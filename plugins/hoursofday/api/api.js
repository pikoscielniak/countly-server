var plugin = {},
    common = require('../../../api/utils/common.js'),
    plugins = require('../../pluginManager.js'),
    fetch = require('../../../api/parts/data/fetch.js');

var hodCollectionName = "hod";

function isIntInRange(str, start, end) {
    var num = parseInt(str, 10);
    return start <= num && num < end;
}

function dayIsValid(dayStr) {
    return isIntInRange(dayStr, 1, 8);
}

function hourIsValid(hourStr) {
    return isIntInRange(hourStr, 0, 24);
}

(function (plugin) {
    plugins.register("/session/begin", function (ob) {
        var day = "" + ob.params.qstring.begin_session_day;
        var hour = "" + ob.params.qstring.begin_session_hour;

        if (dayIsValid(day) && hourIsValid(hour)) {
            var incProp = day + "." + hour;
            var incObj = {};
            incObj[incProp] = 1;
            common.db.collection(hodCollectionName).update({'_id': ob.params.app_id},
                {'$inc': incObj}, {'upsert': true},
                function () {
                });
        }
    });
    plugins.register("/o", function (ob) {
        var params = ob.params;
        var validateUserForDataReadAPI = ob.validateUserForDataReadAPI;
        if (params.qstring.method == "hours_of_day") {
            validateUserForDataReadAPI(params, fetch.fetchCollection, hodCollectionName);
            return true;
        }
        return false;
    });

    plugins.register("/i/apps/delete", function (ob) {
        var appId = ob.appId;
        common.db.collection(hodCollectionName).remove({'_id': {$regex: appId + ".*"}}, function () {
        });
    });

    plugins.register("/i/apps/reset", function (ob) {
        var appId = ob.appId;
        common.db.collection(hodCollectionName).remove({'_id': {$regex: appId + ".*"}}, function () {
        });
    });

    plugins.register("/i/apps/clear", function (ob) {
        var appId = ob.appId;
        var ids = ob.ids;
        common.db.collection(hodCollectionName).remove({$and: [{'_id': {$regex: appId + ".*"}}, {'_id': {$nin: ids}}]},
            function () {
            });
    });
}(plugin));

module.exports = plugin;