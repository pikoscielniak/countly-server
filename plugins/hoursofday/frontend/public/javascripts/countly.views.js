(function () {

    function getChartOptions(data) {
        return {
            domElemId: "dashboard-graph",
            data: data
        };
    }

    function drawChart(hoursOfDayData) {
        dayHourHeatmap.draw(getChartOptions(hoursOfDayData));
    }

    function refreshChart(hoursOfDayData) {
        dayHourHeatmap.refresh(getChartOptions(hoursOfDayData));
    }

    window.HoursOfDayView = countlyView.extend({
        beforeRender: function () {
            return $.when(hoursOfDay.initialize()).then(function () {
            });
        },
        renderCommon: function (isRefresh) {
            var hoursOfDayData = hoursOfDay.getData();
            this.templateData = {
                "page-title": jQuery.i18n.map["hoursOfDay.title"],
                "logo-class": "hours-of-day"
            };

            if (!isRefresh) {
                $(this.el).html(this.template(this.templateData));
                drawChart(hoursOfDayData);
            }

            $("#date-selector").hide();
            $("#dataTableOne").hide();
        },
        refresh: function () {
            var self = this;
            $.when(hoursOfDay.refresh()).then(function () {
                if (app.activeView != self) {
                    return false;
                }
                self.renderCommon(true);

                newPage = $("<div>" + self.template(self.templateData) + "</div>");

                $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

                var hoursOfDayData = hoursOfDay.getData();
                refreshChart(hoursOfDayData);
            });
        }
    });

//register views
    app.hoursOfDayView = new HoursOfDayView();

    app.route("/analytics/hours-of-day", 'hoursOfDay', function () {
        this.renderWhenReady(this.hoursOfDayView);
    });
    $(document).ready(function () {
        var menu = '<a href="#/analytics/hours-of-day" class="item">' +
            '<div class="logo hours-of-day"></div>' +
            '<div class="text" data-localize="sidebar.analytics.hoursOfDay"></div>' +
            '</a>';
        $('#analytics-submenu').append(menu);
    });
}());
