const removeDuplicates = <T>(arr: T[], filterFn: (el: T) => any) => {
  const set = new Map();
  arr.forEach(item => {
    set.set(filterFn(item), item);
  });
  return [...set.values()];
};

export default {
  removeDuplicates,
};
