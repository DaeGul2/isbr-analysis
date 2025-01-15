export const filterDataByGroup = (data, groups) => {
    return data.filter((row) => groups.includes(row["결과"]));
  };
  
  export const calculateStatistics = (filteredData, columns) => {
    return columns.map((col) => {
      const values = filteredData.map((row) => row[col]).filter(Number);
      return {
        column: col,
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
      };
    });
  };
  