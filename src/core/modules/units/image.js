const Modules = import.meta.globEager(`../../../assets/images/*/*`, { eager: true });

export default {
    /**
     * @description 获取图片文件
     * @param 文件名称 file
     * @param 精确文件名称 precise_file
     */
    getImageFile(file, precise_file, type = 'png') {
        const path = `../../../assets/images/${file}/${precise_file}.${type}`;
        return Modules[path].default;
    },
    ifImageUrl(url, host = '') {
        if (url) {
            return host + url
        } else {
            return Modules[`../assets/images/defult_img.png`].default
        }
    },
};
