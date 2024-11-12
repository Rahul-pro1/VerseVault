function createUniqueIdGenerator() {
    let counter = 0;
  
    return function() {
      counter += 1;
      return `id_${counter}`;
    };
  }
  
//   const getUniqueId = createUniqueIdGenerator();
  
//   // Usage:
//   console.log(getUniqueId()); // id_1
//   console.log(getUniqueId()); // id_2
//   console.log(getUniqueId()); // id_3
  
