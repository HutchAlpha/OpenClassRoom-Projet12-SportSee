import { useEffect, useState } from 'react'
import './styles/App.scss'
import { getData } from './DonneeApi/sportseeApi'


const userData = getData(12);
console.log(userData);

function App() {



}

export default App
