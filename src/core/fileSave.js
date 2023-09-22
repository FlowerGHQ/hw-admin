import FileSaver from 'file-saver'
export default class fileSave {
  /**
     * 导出Excel文件
     * @param {*} res   文件流
     * @param {*} name  文件名
     */
  static getZip(res, name) {
    const blob = new Blob([res], {
      type: 'application/zip;charset=utf-8'
    })
    FileSaver.saveAs(blob, name)
  }
  //........可以根据自己的需要继续拓展
}