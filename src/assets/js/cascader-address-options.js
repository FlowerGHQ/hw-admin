import provinces from './china-division/provinces.json';
import cities from './china-division/cities.json';
import areas  from './china-division/areas.json';
import hkmotw from './china-division/HK-MO-TW.json';


areas.forEach((area) => {
  const matchCity = cities.filter(city => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.name,
      code: area.code,
    });
  }
});

cities.forEach((city) => {
  const matchProvince = provinces.filter(province => province.code === city.provinceCode)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.name,
      code: city.code,
      children: city.children,
    });
  }
});

let options = provinces.map(province => ({
  label: province.name,
  value: province.name,
  code: province.code,
  children: province.children,
}));


// 合并港澳台行政区
const _hkmotw = Object.entries(hkmotw).map(([provinceName, provinceItem]) => {
  return {
    label: provinceName,
    value: provinceName,
    children: Object.entries(provinceItem).map(([cityName, cityItem]) => {
      return {
        label: cityName,
        value: cityName,
        children: cityItem.map(area => {
          return {
            label: area,
            value: area
          }
        })
      }
    })
  }
})
options = options.concat(_hkmotw)

export default options;
