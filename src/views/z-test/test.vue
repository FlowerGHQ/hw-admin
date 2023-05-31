<template>
    <div>        
        <div id="container" class="chart"></div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { Chart } from '@antv/g2';
        
    const chart = ref(null)

    onMounted(() => {
        chart.value = new Chart({
            container: 'container',
            autoFit: true,            
            height: 500,
            // width: 600,
        });
        test()
    })

    const test = () => {    
        
        const data1 = [
            { year: '2023-05-20', value: 5, value1: 1, value2: 13},
            { year: '2023-05-21', value: 2, value1: 2, value2: 2},
            { year: '2023-05-22', value: 11, value1: 3, value2: 13},
            { year: '2023-05-23', value: 4, value1: 4, value2: 5},
        ]
        const data = [
            { country: 'Asia', year: '1750', value: 502 },
            { country: 'Asia', year: '1800', value: 635 },
            { country: 'Asia', year: '1850', value: 809 },
            { country: 'Asia', year: '1900', value: 5268 },
            { country: 'Asia', year: '1950', value: 4400 },
            { country: 'Asia', year: '1999', value: 3634 },
            { country: 'Asia', year: '2050', value: 947 },

            { country: 'Africa', year: '1750', value: 106 },
            { country: 'Africa', year: '1800', value: 107 },
            { country: 'Africa', year: '1850', value: 111 },
            { country: 'Africa', year: '1900', value: 1766 },
            { country: 'Africa', year: '1950', value: 221 },
            { country: 'Africa', year: '1999', value: 767 },
            { country: 'Africa', year: '2050', value: 133 },

            { country: 'Europe', year: '1750', value: 163 },
            { country: 'Europe', year: '1800', value: 203 },
            { country: 'Europe', year: '1850', value: 276 },
            { country: 'Europe', year: '1900', value: 628 },
            { country: 'Europe', year: '1950', value: 547 },
            { country: 'Europe', year: '1999', value: 729 },
            { country: 'Europe', year: '2050', value: 408 },

            { country: 'Oceania', year: '1750', value: 200 },
            { country: 'Oceania', year: '1800', value: 200 },
            { country: 'Oceania', year: '1850', value: 200 },
            { country: 'Oceania', year: '1900', value: 460 },
            { country: 'Oceania', year: '1950', value: 230 },
            { country: 'Oceania', year: '1999', value: 300 },
            { country: 'Oceania', year: '2050', value: 300 },
        ];
        
        chart.value.data(data1);

        chart.value.scale({
            year:{                
                type: 'cat',  
                range: [0.03, 0.92],
            },
            value:{
                nice: true,                
            },
            value1:{
                nice: true,                
            },
            value2:{
                nice: true,                
            },
        });

        chart.value.legend("value1",{
            position: 'top',
        });


        chart.value.area()
            .position('year*value1')
            .shape('smooth')
            .color('#604e78')

        chart.value.line()
            .position('year*value1')
            .shape('smooth')
            .color('#604e78')
            .size(2)

        chart.value.area()
            .position('year*value2')
            .shape('smooth')
            .color('#31781d')


        chart.value.line()
            .position('year*value2')
            .shape('smooth')
            .color('#31781d')
            .size(2)

        chart.value.interaction('element-highlight');

        chart.value.render();
    }
</script>

<style lang="less" scoped>
.chart{
    width: 800px;
    margin-top: 100px;
    margin-left: 40px;
}
</style>