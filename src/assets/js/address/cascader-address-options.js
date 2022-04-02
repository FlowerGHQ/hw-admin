import continents from './continents.json';
import countries from './countries.json';
import states from './states.json';
import cities from './cities.json';
import regions from './regions.json';

regions.forEach((region) => {
    const matchCity = cities.filter(city => city.id === region.city_id)[0];
    if (matchCity) {
        matchCity.children = matchCity.children || [];
        matchCity.children.push({
            id: region.id,
            code: region.code,
            name: region.name,
            name_en: region.name_en,
        });
    }
})

cities.forEach((city) => {
    const matchStates = states.filter(state => state.id === city.state_id)[0];
    if (matchStates) {
        matchStates.children = matchStates.children || [];
        matchStates.children.push({
            id: city.id,
            code: city.code,
            name: city.name,
            name_en: city.name_en,
            children: city.children,
        });
    }
})

states.forEach((state) => {
    const matchCountry = countries.filter(country => country.id === state.country_id)[0];
    if (matchCountry) {
        matchCountry.children = matchCountry.children || [];
        matchCountry.children.push({
            id: state.id,
            code: state.code,
            name: state.name,
            name_en: state.name_en,
            children: state.children,
        });
    }
})

countries.forEach((country) => {
    const matchContinent = continents.filter(continent => continent.id === country.continent_id)[0];
    if (matchContinent) {
        matchContinent.children = matchContinent.children || [];
        matchContinent.children.push({
            id: country.id,
            code: country.code,
            name: country.name,
            name_en: country.name_en,
            children: country.children,
        });
    }
})

let options = continents.map(continent => ({
    id: continent.id,
    code: continent.code,
    name: continent.name,
    name_en: continent.name_en,
    children: continent.children,
}));

console.log('options:', JSON.stringify(options, null, 4))
export default options;