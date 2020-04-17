import { AJAX, ALERT, COLOR, TOAST } from '../common';
import { validate } from 'revalidator';

export const schedule = {
  namespace: 'schedule',
  cal: null,
  caldedars: [],
  findCalendar(id) {
    let found;

    APP.caldedars.forEach(function(calendar) {
      if (calendar.id === id) {
        found = calendar;
      }
    });

    return found || APP.caldedars[0];
  },
  getTimeTemplate(schedule, isAllDay) {
    let html = [];
    let start = moment(schedule.start.toUTCString());
    if (!isAllDay) {
      html.push('<strong>' + start.format('HH:mm') + '</strong> ');
    }
    if (schedule.isPrivate) {
      html.push('<span class="calendar-font-icon ic-lock-b"></span>');
      html.push(' Private');
    } else {
      if (schedule.isReadOnly) {
        html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
      } else if (schedule.recurrenceRule) {
        html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
      } else if (schedule.attendees.length) {
        html.push('<span class="calendar-font-icon ic-user-b"></span>');
      } else if (schedule.location) {
        html.push('<span class="calendar-font-icon ic-location-b"></span>');
      }
      html.push(' ' + schedule.title);
    }

    return html.join('');
  },
  onClickMenu(e) {
    let target = $(e.target).closest('a[role="menuitem"]')[0];
    let action = APP.getDataAction(target);
    let options = APP.cal.getOptions();
    let viewName = '';

    switch (action) {
      case 'toggle-daily':
        viewName = 'day';
        break;
      case 'toggle-weekly':
        viewName = 'week';
        break;
      case 'toggle-monthly':
        options.month.visibleWeeksCount = 0;
        viewName = 'month';
        break;
      case 'toggle-weeks2':
        options.month.visibleWeeksCount = 2;
        viewName = 'month';
        break;
      case 'toggle-weeks3':
        options.month.visibleWeeksCount = 3;
        viewName = 'month';
        break;
      case 'toggle-narrow-weekend':
        options.month.narrowWeekend = !options.month.narrowWeekend;
        options.week.narrowWeekend = !options.week.narrowWeekend;
        viewName = APP.cal.getViewName();

        target.querySelector('input').checked = options.month.narrowWeekend;
        break;
      case 'toggle-start-day-1':
        options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
        options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
        viewName = APP.cal.getViewName();

        target.querySelector('input').checked = options.month.startDayOfWeek;
        break;
      case 'toggle-workweek':
        options.month.workweek = !options.month.workweek;
        options.week.workweek = !options.week.workweek;
        viewName = APP.cal.getViewName();

        target.querySelector('input').checked = !options.month.workweek;
        break;
      default:
        break;
    }

    APP.cal.setOptions(options, true);
    APP.cal.changeView(viewName, true);

    APP.setDropdownCalendarType();
    APP.setRenderRangeText();
  },
  async onClickNavi(e) {
    let action = APP.getDataAction(e.target);

    switch (action) {
      case 'move-prev':
        cal.prev();
        break;
      case 'move-next':
        cal.next();
        break;
      case 'move-today':
        cal.today();
        break;
      default:
        return;
    }

    APP.setRenderRangeText();
    await APP.setSchedules();
  },
  onChangeNewScheduleCalendar(e) {
    let target = $(e.target).closest('a[role="menuitem"]')[0];
    let calendarId = getDataAction(target);
    APP.changeNewScheduleCalendar(calendarId);
  },
  changeNewScheduleCalendar(calendarId) {
    let calendarNameElement = document.getElementById('calendarName');
    let calendar = APP.findCalendar(calendarId);
    let html = [];

    html.push(
      '<span class="calendar-bar" style="background-color: ' +
        calendar.bgColor +
        '; border-color:' +
        calendar.borderColor +
        ';"></span>',
    );
    html.push('<span class="calendar-name">' + calendar.name + '</span>');

    calendarNameElement.innerHTML = html.join('');

    selectedCalendar = calendar;
  },
  createNewSchedule(event) {
    let start = event.start ? new Date(event.start.getTime()) : new Date();
    let end = event.end
      ? new Date(event.end.getTime())
      : moment()
          .add(1, 'hours')
          .toDate();

    APP.cal.openCreationPopup({
      start: start,
      end: end,
    });
  },
  onChangeCalendars(e) {
    let calendarId = e.target.value;
    let checked = e.target.checked;
    let viewAll = document.querySelector('.lnb-calendars-item input');
    let calendarElements = Array.prototype.slice.call(
      document.querySelectorAll('#calendarList input'),
    );
    let allCheckedCalendars = true;

    if (calendarId === 'all') {
      allCheckedCalendars = checked;

      calendarElements.forEach(function(input) {
        let span = input.parentNode;
        input.checked = checked;
        span.style.backgroundColor = checked
          ? span.style.borderColor
          : 'transparent';
      });

      APP.caldedars.forEach(function(calendar) {
        calendar.checked = checked;
      });
    } else {
      APP.findCalendar(calendarId).checked = checked;

      allCheckedCalendars = calendarElements.every(function(input) {
        return input.checked;
      });

      if (allCheckedCalendars) {
        viewAll.checked = true;
      } else {
        viewAll.checked = false;
      }
    }

    APP.refreshScheduleVisibility();
  },
  refreshScheduleVisibility() {
    let cal = this.cal || APP.cal;
    let caldedars = this.caldedars || APP.caldedars;

    let calendarElements = Array.prototype.slice.call(
      document.querySelectorAll('#calendarList input'),
    );

    for (const cldrs of caldedars) {
      cal.toggleSchedules(cldrs.id, !cldrs.checked, false);
    }

    cal.render(true);

    for (const cldrEl of calendarElements) {
      let span = cldrEl.nextElementSibling;
      span.style.backgroundColor = cldrEl.checked
        ? span.style.borderColor
        : 'transparent';
    }
  },
  setDropdownCalendarType() {
    let calendarTypeName = document.getElementById('calendarTypeName');
    let calendarTypeIcon = document.getElementById('calendarTypeIcon');
    let options = cal.getOptions();
    let type = cal.getViewName();
    let iconClassName;

    if (type === 'day') {
      type = '일 단위';
      iconClassName = 'calendar-icon ic_view_day';
    } else if (type === 'week') {
      type = '1주 단위';
      iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 2) {
      type = '2주 단위';
      iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 3) {
      type = '3주 단위';
      iconClassName = 'calendar-icon ic_view_week';
    } else {
      type = '월 단위';
      iconClassName = 'calendar-icon ic_view_month';
    }

    calendarTypeName.innerHTML = type;
    calendarTypeIcon.className = iconClassName;
  },
  setRenderRangeText() {
    let renderRange = document.getElementById('renderRange');
    let options = cal.getOptions();
    let viewName = cal.getViewName();
    let html = [];
    if (viewName === 'day') {
      html.push(moment(cal.getDate().getTime()).format('YYYY.MM.DD'));
    } else if (
      viewName === 'month' &&
      (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)
    ) {
      html.push(moment(cal.getDate().getTime()).format('YYYY.MM'));
    } else {
      html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
      html.push(' ~ ');
      html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
    }
    renderRange.innerHTML = html.join('');
  },
  setEventListener() {
    $('#menu-navi').on('click', this.onClickNavi);
    $('.dropdown-menu a[role="menuitem"]').on('click', this.onClickMenu);
    $('#lnb-calendars').on('change', this.onChangeCalendars);

    $('#btn-new-schedule').on('click', this.createNewSchedule);

    $('#dropdownMenu-calendars-list').on(
      'click',
      this.onChangeNewScheduleCalendar,
    );

    window.addEventListener('resize', this.resizeThrottled);
  },
  getDataAction(target) {
    return target.dataset
      ? target.dataset.action
      : target.getAttribute('data-action');
  },
  setCalendarGroupRender() {
    let calendarList = document.getElementById('calendarList');
    calendarList.innerHTML = '';
    let html = [];
    this.caldedars.forEach(function(calendar) {
      html.push(
        `
        <div class="lnb-calendars-item">
          <label>
          <input type="checkbox" class="tui-full-calendar-checkbox-round" value="${calendar.id}" checked>
          <span style="border-color: ${calendar.borderColor}; background-color: ${calendar.borderColor};"></span>
          <span>${calendar.name}</span>
          </label>
          <span class="move"><i class="mdi mdi-drag-letiant"></i></span>
          <span class="edit" onclick="APP.scheduleGroupModal(${calendar.id})">
          <i class="mdi mdi-pen"></i>
          </span>
          <span class="delete" onclick="APP.scheduleGroupDelete(${calendar.id})">
          <i class="mdi mdi-window-close"></i>
          </span>
        </div>
        `,
      );
    });
    calendarList.innerHTML = html.join('\n');
  },
  setCalendarSortable() {
    $('#calendarList').sortable({
      handle: '.move',
      update: async (event, ui) => {
        let calendars = [];
        $(
          '#calendarList .lnb-calendars-item .tui-full-calendar-checkbox-round',
        ).each((i, e) => {
          calendars.push(parseInt(e.value));
        });
        await AJAX.post('/group/schedule/odr', { calendars });
      },
    });
  },
  async setCalendars() {
    this.caldedars = await fx.go(
      AJAX.fetch('/api/group/schedule'),
      fx.map(e => {
        return {
          id: String(e.idx),
          name: e.name,
          color: '#ffffff',
          bgColor: e.color,
          dragBgColor: e.color,
          borderColor: e.color,
          checked: true,
        };
      }),
    );
    APP.cal.setCalendars(this.caldedars);
    this.setCalendarGroupRender();
    this.setCalendarSortable();
  },
  async setSchedules() {
    this.cal.clear();
    const startAt = moment(this.cal.getDateRangeStart().getTime())
      .subtract(1, 'months')
      .format('YYYYMMDD');
    const endAt = moment(this.cal.getDateRangeEnd().getTime())
      .add(1, 'months')
      .format('YYYYMMDD');
    let schedules = await fx.go(
      AJAX.fetch('/api/schedule', {
        startAt,
        endAt,
      }),
      fx.map(e => {
        let color = APP.findCalendar(String(e.scheduleGroupIdx)).bgColor;
        return {
          id: e.idx,
          title: e.title,
          isAllDay: e.allDay,
          start: e.startAt,
          end: e.endAt,
          color: '#ffffff',
          isVisible: true,
          bgColor: color,
          dragBgColor: color,
          borderColor: color,
          calendarId: String(e.scheduleGroupIdx),
          category: e.allDay ? 'allday' : 'time',
          location: e.location,
          state: e.state,
        };
      }),
    );

    this.cal.createSchedules(schedules);
    this.refreshScheduleVisibility();
  },
  async calendarInit() {
    this.cal = new tui.Calendar('#calendar', {
      defaultView: 'month',
      useCreationPopup: true,
      useDetailPopup: true,
      taskView: ['allday'],
      template: {
        milestone: function(model) {
          return (
            '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
            model.bgColor +
            '">' +
            model.title +
            '</span>'
          );
        },
        allday(schedule) {
          return APP.getTimeTemplate(schedule, true);
        },
        time(schedule) {
          return APP.getTimeTemplate(schedule, false);
        },
        milestoneTitle: function() {
          return '<span class="tui-full-calendar-left-content">중요</span>';
        },
        alldayTitle: function() {
          return '<span class="tui-full-calendar-left-content">종일</span>';
        },
        popupIsAllDay: function() {
          return '종일';
        },
        popupStateFree: function() {
          return '중요';
        },
        popupStateBusy: function() {
          return '일반';
        },
        titlePlaceholder: function() {
          return '제목';
        },
        locationPlaceholder: function() {
          return '장소';
        },
        startDatePlaceholder: function() {
          return '시작일';
        },
        endDatePlaceholder: function() {
          return '종료일';
        },
        popupSave: function() {
          return '저장';
        },
        popupUpdate: function() {
          return '수정';
        },
        popupEdit: function() {
          return '수정';
        },
        popupDelete: function() {
          return '삭제';
        },
      },
      month: {
        daynames: [
          '일요일',
          '월요일',
          '화요일',
          '수요일',
          '목요일',
          '금요일',
          '토요일',
        ],
      },
      week: {
        daynames: [
          '일요일',
          '월요일',
          '화요일',
          '수요일',
          '목요일',
          '금요일',
          '토요일',
        ],
      },
    });

    this.cal.on({
      async beforeCreateSchedule(e) {
        let scheduleData = e;
        let calendar =
          scheduleData.calendar || APP.findCalendar(scheduleData.calendarId);

        const data = await AJAX.post('/schedule', {
          scheduleGroupIdx: scheduleData.calendarId,
          title: scheduleData.title,
          location: scheduleData.location,
          state: scheduleData.state,
          allDay: scheduleData.isAllDay,
          startAt: moment(scheduleData.start._date).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          endAt: moment(scheduleData.end._date).format('YYYY-MM-DD HH:mm:ss'),
        });

        if (!data) {
          return;
        }

        TOAST.success(data.message);

        let schedule = {
          id: data.idx,
          title: scheduleData.title,
          isAllDay: scheduleData.isAllDay,
          start: scheduleData.start,
          end: scheduleData.end,
          category: scheduleData.isAllDay ? 'allday' : 'time',
          dueDateClass: '',
          color: calendar.color,
          bgColor: calendar.bgColor,
          dragBgColor: calendar.bgColor,
          borderColor: calendar.borderColor,
          location: scheduleData.location,
          raw: {
            class: scheduleData.raw.class,
          },
          state: scheduleData.state,
        };

        if (calendar) {
          schedule.calendarId = calendar.id;
          schedule.color = calendar.color;
          schedule.bgColor = calendar.bgColor;
          schedule.borderColor = calendar.borderColor;
        }

        APP.cal.createSchedules([schedule]);

        APP.refreshScheduleVisibility();
      },
      async beforeUpdateSchedule(e) {
        e.schedule.start = e.start;
        e.schedule.end = e.end;

        let scheduleData = e.schedule;
        let calendarId = e.schedule.calendarId;
        let scheduleId = e.schedule.id;

        let ctrl = APP.cal._controller,
          ownSchedules = ctrl.schedules,
          schedule = ownSchedules.single(function(model) {
            return model.id === scheduleId;
          });

        if (schedule) {
          let calendarInfo = ctrl.calendars.filter(function(e) {
            return e.id == calendarId;
          });

          const res = await AJAX.put(`/schedule/${e.schedule.id}`, {
            scheduleGroupIdx: calendarId,
            title: e.schedule.title,
            location: e.schedule.location,
            state: e.schedule.state,
            allDay: !!e.schedule.isAllDay,
            startAt: moment(e.start._date).format('YYYY-MM-DD HH:mm:ss'),
            endAt: moment(e.end._date).format('YYYY-MM-DD HH:mm:ss'),
          });

          if (!res) return;

          schedule.title = e.schedule.title;
          schedule.isAllDay = e.schedule.isAllDay ? 1 : 0;
          schedule.calendarId = calendarId;
          schedule.color = calendarInfo[0].color;
          schedule.bgColor = calendarInfo[0].bgColor;
          schedule.borderColor = calendarInfo[0].borderColor;
          schedule.dragBgColor = calendarInfo[0].dragBgColor;
          schedule.start = e.start;
          schedule.end = e.end;
          schedule.location = e.schedule.location;
          schedule.state = e.schedule.state;

          APP.cal.updateSchedule(schedule, scheduleData);
          APP.refreshScheduleVisibility();

          TOAST.success(res.message);
        }
      },
      async beforeDeleteSchedule(e) {
        const { value } = await ALERT.confirm(
          `선택하신 스케줄을 삭제할까요?</span>`,
        );
        if (value) {
          const res = await AJAX.delete(`/schedule/${e.schedule.id}`);
          APP.cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
          TOAST.success(res.message);
        }
      },
      clickTimezonesCollapseBtn(timezonesCollapsed) {
        if (timezonesCollapsed) {
          APP.cal.setTheme({
            'week.daygridLeft.width': '77px',
            'week.timegridLeft.width': '77px',
          });
        } else {
          APP.cal.setTheme({
            'week.daygridLeft.width': '60px',
            'week.timegridLeft.width': '60px',
          });
        }

        return true;
      },
    });

    this.resizeThrottled = tui.util.throttle(() => {
      APP.cal.render();
    }, 50);

    window.cal = this.cal;

    await this.setCalendars();
    await this.setSchedules();

    this.setDropdownCalendarType();
    this.setRenderRangeText();
    this.setEventListener();
  },
  async scheduleGroupAction(idx) {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        name: {
          requried: true,
          allowEmpty: false,
          message: '이름을 입력해주세요',
        },
        color: {
          requried: true,
          allowEmpty: false,
          message: '색상을 선택해주세요',
        },
      },
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    let rs;
    if (idx) {
      rs = await AJAX.put(`/group/schedule/${idx}`, form);
    } else {
      rs = await AJAX.post('/group/schedule', form);
    }

    if (rs) {
      await APP.setCalendars();
      await APP.setSchedules();
      let modal = $('#remodal').remodal();
      modal.close();
    }

    return false;
  },
  async scheduleGroupDelete(idx) {
    const rowCount = await AJAX.get(`/schedule/count/${idx}`);
    const { value } = await ALERT.confirm(
      `선택하신 그룹을 삭제할까요?<span style="color:#ff4040;">${
        rowCount !== 0
          ? '<br>※ 연관된 스케줄' + rowCount + '개가 함께 삭제됩니다.'
          : ''
      }</span>`,
    );
    if (value) {
      const { message } = await AJAX.delete(`/group/schedule/${idx}`);
      TOAST.success(message);
      await APP.setCalendars();
      await APP.setSchedules();
    }
  },
  async scheduleGroupModal(idx = null) {
    let group = {
      name: '',
      color: '',
    };

    if (idx) {
      group = await AJAX.get(`/group/schedule/${idx}`);
    }

    let template = `
    <style>
      #remodal .confirm {margin-top: 64px;}
    </style>
    <div class="title">그룹 ${idx ? '수정' : '추가'}</div>
    <form method="POST" onsubmit="APP.scheduleGroupAction(${idx});">
      <div class="form_group">
        <span>이름</span>
        <input type="text" name="name" value="${group.name}">
      </div>
      <div class="form_group">
        <span>색상</span>
        <select id="colorSelect" class="color-select" name="color">
        ${(() =>
          fx.go(
            COLOR.pallet,
            fx.map(e => `<option value="${e}">${e}</option>`),
          ))()}
        </select>
      </div>
      <div class="confirm">
        <button type="submit" class="remodal-confirm">저장</button>
      </div>
    </form>
    `;

    $('#remodal .contents_slot').html(template);

    $('#remodal #colorSelect').colorSelect(`${group.color}`);

    let modal = $('#remodal').remodal();
    modal.open();
  },
  init() {
    this.calendarInit();
  },
};
