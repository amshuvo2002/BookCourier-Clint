import axios from 'axios';
import React from 'react';

const AxiousSecure = axios.create({
    baseURL:"http://localhost:3000/"
})
const UseAxious = () => {
    return AxiousSecure
};

export default UseAxious;