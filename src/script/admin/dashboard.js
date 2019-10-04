import { BROWSER, AJAX } from "../common";

export const dashboard = {
  namespace: "dashboard",
  aside() {
    const today = moment().format("YYYY.MM.DD");
    $("#today").text(today);
  },
  systemInfo() {
    $("#sysInfoDonut").peity("donut", {
      width: "150",
      height: "150",
      fill: ["#004abf", "#efefef"],
      innerRadius: 60,
      radius: 80
    });
  },
  async updateTaskCompleted() {
    let li = $(event.target).parents("li");
    const idx = li.attr("data-idx");
    const completed = li.hasClass("completed");
    const taskCount = $("#taskCount").text();

    await AJAX.put(`/task/complete/${idx}`, { completed: !completed });
    li.toggleClass("completed");

    completed
      ? $("#taskCount").text(parseInt(taskCount) + 1)
      : $("#taskCount").text(parseInt(taskCount) - 1);
  },
  init() {
    this.aside();
    this.systemInfo();
  }
};
