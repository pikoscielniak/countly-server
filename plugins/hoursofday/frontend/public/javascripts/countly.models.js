(function (hoursOfDay, $) {

    //we will store our data here
    var _data = {};

    var val1 = 1;
    var val2 = 2;
    var val3 = 3;
    var val4 = 4;
    var val5 = 5;
    var val6 = 6;
    var val7 = 7;

    function fetchData() {
        if (countlyCommon.DEBUG) {
            _data = {
                _id: '532454254253235',
                '1': {'0': 2},
                '2': {'1': 12},
                '3': {'2': 1},
                '4': {'21': 34},
                '5': {'22': 61},
                '6': {'23': 10},
                '7': {'7': 10}
            };
            function getNum() {
                return Math.round(Math.random() * 10);
            }

            val1 += getNum();
            val2 += getNum()
            val3 += getNum()
            val4 += getNum()
            val5 += getNum()
            val6 += getNum()
            val6 += getNum()
            _data['1']['0'] = val1;
            _data['2']['1'] = val2;
            _data['3']['2'] = val3;
            _data['4']['21'] = val4;
            _data['5']['22'] = val5;
            _data['6']['23'] = val6;
            _data['7']['7'] = val7;
            return true;
        }
        //returning promise
        return $.ajax({
            type: "GET",
            url: "/o",
            data: {
                //providing current user's api key
                "api_key": countlyGlobal.member.api_key,
                //providing current app's id
                "app_id": countlyCommon.ACTIVE_APP_ID,
                //specifying method param
                "method": "hours_of_day"
            },
            success: function (json) {
                _data = json;
            }
        });
    }


    //Initializing model
    hoursOfDay.initialize = fetchData;

    hoursOfDay.refresh = fetchData;

    function isValueIn(fetchedData, day, hour) {
        var hoursOfDay = fetchedData["" + day];

        if (!hoursOfDay) return false;

        return !!hoursOfDay["" + hour];
    }

    function getValueFrom(fetchedData, day, hour) {
        return fetchedData["" + day]["" + hour];
    }

    function initCharData(fetchedData) {
        var normalizedData = [];
        var daysRange = _.range(1, 8);
        var hoursRange = _.range(24);
        _.each(daysRange, function (day) {
            _.each(hoursRange, function (hour) {
                var dayHourItem = {
                    day: day,
                    hour: hour,
                    value: 0
                };
                if (isValueIn(fetchedData, day, hour)) {
                    dayHourItem.value = getValueFrom(fetchedData, day, hour);
                }
                normalizedData.push(dayHourItem);
            });
        });
        return normalizedData;
    }

    //return data that we have
    hoursOfDay.getData = function () {
        delete _data._id;
        return initCharData(_data);
    };

}(window.hoursOfDay = window.hoursOfDay || {}, jQuery));