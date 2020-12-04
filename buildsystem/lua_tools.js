function json2lua(json) {
  if (typeof json === "number") {
    return `${json}`;
  } else if (typeof json === "string") {
    return `"${string}"`; // TODO: Escape characters
  } else if (typeof json === "boolean") {
    return json ? "true" : "false";
  } else if (Array.isArray(json)) {
    return `{${json.map((v) => json2lua(v)).join(",")}}`;
  } else if (typeof json === "object") {
    let lua = "{\n";
    for (const key in json) {
      lua += `${key} = ${json2lua(json[key])},\n`;
    }
    lua += "}";
    return lua;
  }
}

module.exports.json2lua = function (json) {
  return json2lua(json);
}
