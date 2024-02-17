/*
 * @Author: douzhiyuan
 * @Date: 2023-09-22 21:21:07
 * @LastEditors:
 * @LastEditTime: 2023-09-25 09:55:49
 * @Description: 请填写简介
 */
import FileSaver from 'file-saver';
export default class fileSave {
    /**
     * 导出Excel文件
     * @param {*} res   文件流
     * @param {*} name  文件名
     */
    static getFile(res, name) {
        const blob = new Blob([res], {
            type: 'application/zip;charset=utf-8',
        });
        FileSaver.saveAs(blob, name);
    }
    //........可以根据自己的需要继续拓展
}
