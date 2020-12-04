module.exports.convertRenderList = function(renderList) {
  const converted = [];

  for (let c = 0; c < renderList.length; c++) {
    converted.push(renderList[c].model);
    converted.push(renderList[c].campath);
  }

  return converted;
};