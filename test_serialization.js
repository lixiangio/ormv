const { toString } = Object.prototype;

const city = {
  "hot": [
    "北京", "上海", "广州"
  ],
  "index": [
    {
      "code": "bj",
      "open": true,
      // "date": new Date()
    },
    {
      "code": "sh",
      "open": true
    }
  ],
  "all": {
    "北京": {
      "code": "bj",
      "open": true
    },
    "上海": {
      "code": "sh",
      "open": true
    },
    "广州": {
      "code": "gz",
      "open": true
    },
    "深圳": {
      "code": "sz",
      "open": true
    },
    "杭州": {
      "code": "hz",
      "open": true
    },
    "成都": {
      "code": "cd",
      "open": true
    },
    "南京": {
      "code": "nj",
      "open": true
    },
    "天津": {
      "code": "tj",
      "open": true
    },
    "重庆": {
      "code": "cq",
      "open": true
    }
  }
}

function recursion(data) {

  let jsonString = '';

  if (typeof data === 'string') {

    jsonString = `"${data}"`;

  } else if (typeof data === 'number') {

    jsonString = data;

  } else if (typeof data === 'boolean') {

    jsonString = data;

  } else if (Array.isArray(data)) {

    const items = [];

    for (const item of data) {
      const itemString = recursion(item);
      items.push(itemString);
    }

    jsonString = `[${items.join()}]`;

  } else if (toString.call(data) === '[object Object]') {

    const items = [];

    for (const name in data) {
      const value = recursion(data[name]);
      items.push(`"${name}": ${value}`)
    }

    jsonString = `{${items.join()}}`;

  } else if (typeof data === 'date') {

    jsonString = `"${data}"`;

  } else {

    throw new Error(`${data}类型无效`);
    
  }

  return jsonString;

}

console.log(recursion(city))