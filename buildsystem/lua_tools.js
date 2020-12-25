function json2lua(json) {
  if (typeof json === "number") {
    if (Math.floor(json) == json) {
      return `${json}`;
    } else {
      const isNegative = (json < 0);
      const num = Math.floor(Math.abs(json) * 65536);

      if (num == 0) {
        return "0";
      }

      let str = num.toString(16);
      while (str.length < 4) {
        str = "0" + str;
      }
      str = str.substring(0, str.length - 4) + "." + str.substring(str.length - 4);
      while (str.endsWith("0")) {
        str = str.substring(0, str.length - 1);
      }
      str = `${isNegative ? "-" : ""}0x${str}`;

      return `${str}`;
    }
  } else if (typeof json === "string") {
    return `"${json}"`; // TODO: Escape characters
  } else if (typeof json === "boolean") {
    return json ? "true" : "false";
  } else if (Array.isArray(json)) {
    return `{${json.map((v) => json2lua(v)).join(",")}}`;
  } else if (typeof json === "object") {
    let lua = "{\n";
    for (const key in json) {
      lua += `${key}=${json2lua(json[key])},\n`;
    }
    lua += "}";
    return lua;
  }
}

module.exports.json2lua = function (json) {
  return json2lua(json);
}
