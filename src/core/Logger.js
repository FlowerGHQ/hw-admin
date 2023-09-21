import Const from "./const";

class Logger  {
    static bgColors = {
        error: "#ff0000",
        warn: "#C25700",
        info: "#5460ff",
    }
    static success() {
        this.conslogFilter("log", arguments)
    }
    static log() {
        this.conslogFilter("log", arguments)
    }

    static error() {
        this.conslogFilter("error", arguments)
    }

    static warn() {
        this.conslogFilter("warn", arguments)
    }

    static info() {
        this.conslogFilter("info", arguments)
    }
    
    // 统一方法输出方法过滤
    static conslogFilter(fn, args) {
        if (Const.NET.DISABLELOG && fn === "log" ) return // 停止输出(只有log的禁用了)

        const time = `[${ this.formatDate() }] `
        const result = fn + " " + time + "%c" + [...args]
        const logStyle = `color: white; background-color: ${ this.bgColors[fn] }; padding: 2px 10px; display: inline-block;`
        // 判断先是否是浏览器是 打印的不是log的话会有颜色
        if (this.isWindows() && fn !== "log") {
            // console[fn](result, logStyle);
            console[fn](`${fn}`, ...args);
        } else {
            console[fn](`${fn}`, ...args);
        }
    }
    // 时间计算
    static formatDate() {
        const date =  new Date();
        const year = date.getFullYear(); // 获取年份
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补零
        const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补零
        const hours = String(date.getHours()).padStart(2, '0'); // 获取小时数，并补零
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟数，并补零
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数，并补零
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 判断其环境是否是浏览器
    static isWindows() {
        return typeof window !== 'undefined'
    }
    
}

export default Logger