const getFilterTaskForDate = (startDate, tasks) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return tasks.filter((task) => {
    const taskDate = new Date(task.planStartDate);
    return taskDate >= startDate && taskDate <= endDate;
  });
};

export default getFilterTaskForDate;
