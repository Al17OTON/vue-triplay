<script setup>
import axios from "axios";
import * as cheerio from "cheerio";
import { onMounted } from "vue";

const test = () => {
    // axios.get('/api/528293263').then((res) => { 
    //     let $ = cheerio.load(res)
    //     let data = $('meta[property="og:title"]').after('content')
    //     console.log(data);
    // })
    axios.create({
        withCredentials: true,
        baseURL: '/api',
        headers: {
            'Access-Control-Allow-Origin':'*'
        }
    }).get('528293263').then((res) => console.log(res));
}

onMounted(() => {
    test();
})
</script>

<template>
    <div>
        test@
    </div>
</template>

<style scoped>

</style>