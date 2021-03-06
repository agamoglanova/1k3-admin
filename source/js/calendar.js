jQuery(function (a) {
    window.PB_CALENDAR_DEFAULTS = {
        schedule_list: function (a, b) {
            a({})
        },
        schedule_dot_item_render: function (a) {
            return a
        },
        day_selectable: !1,
        callback_selected_day: a.noop,
        callback_changed_month: a.noop,
        min_yyyymm: null,
        max_yyyymm: null,
        next_month_button: '<img src="images/left.png" class="icon">',
        prev_month_button: '<img src="images/right.png" class="icon">',
        month_label_format: "MMM",
        year_label_format: "YYYY"
    };
    var b = function (b, c) {
        this._target = a(b), this._options = a.extend(PB_CALENDAR_DEFAULTS, c), this._target.append('<div class="top-frame"><div class="year-month-frame"><span class="year"></span><span class="month"></span></div><div class="control-frame"><a href="#" class="control-btn prev-btn">' + this._options.prev_month_button + '</a><a href="#" class="control-btn next-btn">' + this._options.next_month_button + "</a></div></div>"), this._target.append('<div class="calendar-head-frame"><div class="row row-dayname"><div class="col col-dayname holiday">SUN</div><div class="col col-dayname">MON</div><div class="col col-dayname">TUE</div><div class="col col-dayname">WED</div><div class="col col-dayname">THU</div><div class="col col-dayname">FRI</div><div class="col col-dayname">SAT</div></div></div>'), this._target.append("<div class='calendar-body-frame'></div>"), this._body_frame = this._target.children(".calendar-body-frame");
        var d = this._target.children(".top-frame"), e = d.children(".control-frame");
        this._year_label = d.find(".year-month-frame > .year"), this._month_label = d.find(".year-month-frame > .month"), this._prev_month_btn = e.find(".prev-btn"), this._next_month_btn = e.find(".next-btn"), this._prev_month_btn.click(a.proxy(function (a) {
            var b = this._yyyy_mm_moment.clone();
            return b.subtract(1, "M"), (!this._options.min_yyyymm || !b.isBefore(this._options.min_yyyymm, "month")) && (this.yyyymm(b.format("YYYYMM")), !1)
        }, this)), this._next_month_btn.click(a.proxy(function (a) {
            var b = this._yyyy_mm_moment.clone();
            return b.add(1, "M"), (!this._options.max_yyyymm || !b.isAfter(this._options.max_yyyymm, "month")) && (this.yyyymm(b.format("YYYYMM")), !1)
        }, this)), this._target.data("pb-calendar", this), this._options.min_yyyymm ? this.yyyymm(this._options.min_yyyymm.format("YYYYMM")) : this.yyyymm(moment().format("YYYYMM"))
    };
    b.prototype.yyyymm = function (a) {
        if (void 0 !== a) {
            var b = null;
            if (this._yyyy_mm_moment && (b = this._yyyy_mm_moment.format("YYYYMM")), this._yyyy_mm_moment = moment(a, "YYYYMM"), this.update_view(), b && a !== b && this._options.callback_changed_month.apply(this, [a, b]), this._options.min_yyyymm) {
                var c = this._yyyy_mm_moment.isSameOrBefore(this._options.min_yyyymm, "month");
                this._prev_month_btn.toggleClass("disabled", c)
            }
            if (this._options.max_yyyymm) {
                var c = this._yyyy_mm_moment.isSameOrAfter(this._options.max_yyyymm, "month");
                this._next_month_btn.toggleClass("disabled", c)
            }
        }
        return this._yyyy_mm_moment.format("YYYYMM")
    }, b.prototype._schedule_list = function (b) {
        return a.isFunction(this._options.schedule_list) ? void this._options.schedule_list.apply(this, [a.proxy(function (a) {
            this.callback.apply(this.module, [a])
        }, {module: this, callback: b}), this._yyyy_mm_moment]) : void b.apply(this, [this._options.schedule_list])
    }, b.prototype.update_view = function () {
        this._year_label.text(this._yyyy_mm_moment.format(this._options.year_label_format)), this._month_label.text(this._yyyy_mm_moment.format(this._options.month_label_format));
        var b = this._yyyy_mm_moment, c = parseInt(b.format("YYYYMM")), d = b.clone();
        d.date(1);
        var e = b.clone();
        e.date(31), e.format("MM") !== b.format("MM") && e.subtract(1, "days");
        d.format("E"), e.format("E");
        d.weekday(1).subtract(1, "days"), e.weekday(7).subtract(1, "days");
        for (var f = e.diff(d, "days"), g = d.clone(), h = 0, i = "", j = 0; j <= f; ++j) {
            0 == h && (i += '<div class="row row-day">');
            var k = parseInt(g.format("YYYYMM")), l = g.format("E"), m = 6 == l || 7 == l, n = "";
            k < c ? n = "before-month" : k > c && (n = "after-month"), m && (n += " holiday"), i += '<div class="col ' + n + '" data-day-yyyymmdd="' + g.format("YYYYMMDD") + '">', i += this._options.day_selectable ? '<a href="#" class="day-label" data-selectable-day-yyyymmdd="' + g.format("YYYYMMDD") + '">' + g.format("DD") + "</a>" : g.format("DD"), i += '<div class="schedule-dot-list"></div>', i += "</div>", 6 == h ? (i += "</div>", h = 0) : ++h, g.add(1, "days")
        }
        this._body_frame.html(i), this._schedule_list(function (b) {
            var c = this;
            a.each(b, function (b, d) {
                var e = c._body_frame.find("[data-day-yyyymmdd='" + b + "'] > .schedule-dot-list");
                a.each(d, function () {
                    var b = a('<span class="schedule-dot-item" data-schedule-id="' + this.ID + '"></span>');
                    e.append(b), c._options.schedule_dot_item_render.apply(c, [b, this])
                })
            })
        }), this._options.day_selectable && this._body_frame.find("[data-selectable-day-yyyymmdd]").click(a.proxy(function (b) {
            var c = a(b.currentTarget), d = c.attr("data-selectable-day-yyyymmdd");
            return this._options.callback_selected_day.apply(this, [d]), !1
        }, this))
    }, a.fn.pb_calendar = function (a) {
        var c = this.data("pb-calendar");
        return c ? c : new b(this, a)
    }
});