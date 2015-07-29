var request = require('supertest');
var should = require('should');
var testUtils = require("../../test/testUtils");
request = request(testUtils.url);

var APP_KEY = "";
var API_KEY_ADMIN = "";
var APP_ID = "";
var DEVICE_ID = "1234567890";
var method_name = "hours_of_day";
var begin_session_hour = "begin_session_hour";
var begin_session_day = "begin_session_day";
var query_string_part = getQueryString(2, 1);
var query_string_part2 = getQueryString(5, 2);

function getQueryString(day, hour) {
    var str = "";
    if (day) {
        str += "&" + begin_session_day + "=" + day;
    }
    if (hour) {
        str += "&" + begin_session_hour + "=" + hour;
    }
    return str;
}

function beginSession(query_string) {
    return request
        .get('/i?device_id=' + DEVICE_ID + '&app_key=' + APP_KEY + '&begin_session=1' + query_string)
        .expect(200);
}

function getHoursOfDay() {
    return request
        .get('/o?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&method=' + method_name)
        .expect(200);
}

describe('Hours of day', function () {
    before(function () {
        API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
        APP_ID = testUtils.get("APP_ID");
        APP_KEY = testUtils.get("APP_KEY");
    });

    describe('Empty hours of day', function () {
        it('should have no hours of day metrics', function (done) {
            getHoursOfDay()
                .end(function (err, res) {
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.be.empty;
                    setTimeout(done, 100)
                });
        });
    });

    describe('Hours of day validation', function () {

        describe('when ' + begin_session_day + " is not passed", function () {
            it('nothing should be added', function (done) {
                beginSession("").end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                })
            });
        });

        describe('when wrong ' + begin_session_day + " is passed", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString("fdsf", 11)).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });
        describe('when ' + begin_session_day + " is above range", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(8, 11)).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });

        describe('when ' + begin_session_day + " is below range", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(0, 11)).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });

        describe('when ' + begin_session_hour + " is not passed", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(4, "")).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                })
            });
        });

        describe('when wrong ' + begin_session_hour + " is passed", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(2, "dfsa")).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });
        describe('when ' + begin_session_hour + " is above range", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(3, 24)).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });

        describe('when ' + begin_session_hour + " is below range", function () {
            it('nothing should be added', function (done) {
                beginSession(getQueryString(3, -1)).end(function (err) {
                    if (err) return done(err);
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 1000);
                });
            });
        });
    });

    describe('Writing Hours of day when session begins', function () {
        it('should success', function (done) {
            beginSession(query_string_part)
                .end(function (err, res) {
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(function () {
                        getHoursOfDay()
                            .end(function (err, res) {
                                if (err) return done(err);
                                var ob = JSON.parse(res.text);
                                ob.should.not.be.empty;
                                setTimeout(done, 100)
                            });
                    }, 500);
                });
        });
    });

    describe('Reading Hours of day after three session begins', function () {
        //one started in a previous test
        it('should return proper result', function (done) {
            beginSession(query_string_part2)
                .end(function (err) {
                    if (err) return done(err);
                    beginSession(query_string_part)
                        .end(function (err) {
                            if (err) return done(err);
                            setTimeout(function () {
                                getHoursOfDay()
                                    .end(function (err, res) {
                                        if (err) return done(err);
                                        var ob = JSON.parse(res.text);
                                        var expectedResult = {
                                            _id: ob._id,
                                            '2': {'1': 2},
                                            '5': {'2': 1}
                                        };
                                        ob.should.eql(expectedResult);
                                        setTimeout(done, 100)
                                    });
                            }, 1000);
                        });
                });
        });
    });

    describe('reset app', function () {
        it('should reset data', function (done) {
            var params = {app_id: APP_ID};
            request
                .get('/i/apps/reset?api_key=' + API_KEY_ADMIN + "&args=" + JSON.stringify(params))
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 5000)
                });
        });
    });

    describe('verify empty hours of day', function () {
        it('should have no hours of day', function (done) {
            request
                .get('/o?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&method=' + method_name)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.be.empty;
                    setTimeout(done, 100)
                });
        });
    });
});