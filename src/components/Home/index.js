import {Component} from'react'
import SideBar from '../SideBar'
import { AiOutlineSearch } from 'react-icons/ai'
import Card from '../Card'
import './index.css'


import './index.css'

class Home extends Component{
    state = {
        tokensList: [],
        isLoading: false,
        searchInput: '',
        errorMsg:false,
        headText: '',
        activeTab : ''
    }


    componentDidMount(){
        this.getTokens()
    }
    searchResult = (event)=>{
        console.log(event.target.value)
        this.setState({searchInput : event.target.value},this.searchTokens)
    }

    searchTokens = async() => {
        const {searchInput} = this.state
        this.setState({
            isLoading: true,
        })

        const apiUrl = `https://api.dexscreener.io/latest/dex/search?q=${searchInput}`

        if(searchInput!==""){
            try {
                const {tokensList} = this.state
                const response = await fetch(apiUrl)
                const data = await response.json()
                const max = 10
                const req = data.pairs
                req.sort((a,b)=>b.priceUSD - a.priceUSD)
                const final  = req.slice(0,max)
                this.setState({tokensList: [...final]})
            } catch(error) {
                this.setState({errorMsg: error})
            } finally {
                this.setState({isLoading: false})
            }
        }
        else{
            this.setState({isLoading:false},this.tac)
        }
    }


    tac = async() =>{
        this.setState({
            isLoading: true,
        })
        const apiUrl = "https://api.dexscreener.io/latest/dex/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8,0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        try {
            const {tokensList} = this.state
            const response = await fetch(apiUrl)
            const data = await response.json()
            this.setState({tokensList: [...data.pairs],headText:"Token Search Results"})
        } catch(error) {
            this.setState({errorMsg: error})
        } finally {
            this.setState({isLoading: false,searchInput:'',activeTab:"ta"})
        }
    }

    pac = async() =>{
        this.setState({
            isLoading: true,
        })

        const apiUrl = "https://api.dexscreener.io/latest/dex/pairs/bsc/0x7213a321F1855CF1779f42c0CD85d3D95291D34C,0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae"

        try {
            const {tokensList} = this.state
            const response = await fetch(apiUrl)
            const data = await response.json()
            this.setState({tokensList: [...data.pairs],headText:"Pair Search Results"})
        } catch(error) {
            this.setState({errorMsg: error})
        } finally {
            this.setState({isLoading: false,searchInput:'',activeTab:'pa'})
        }
    }

    getTokens = async() => {
        const {searchInput} = this.state
        this.setState({
            isLoading: true,
        })

        const apiUrl = `https://api.dexscreener.io/latest/dex/search?q=${searchInput}`

        try {
            const {tokensList} = this.state
            const response = await fetch(apiUrl)
            const data = await response.json()
            this.setState({tokensList: [...data.pairs]})
        } catch(error) {
            this.setState({errorMsg: error})
        } finally {
            this.setState({isLoading: false})
        }
    }
    render(){
        const {tokensList,headText,searchInput,activeTab} = this.state
        return(
            <div className='home-container' >
                <SideBar tac={this.tac} pac={this.pac} active={activeTab} />    
                    <div className='mc-container'>
                        <div className='row1' >
                            <div className='search-container'>
                                <input
                                    type='search'
                                    className='search-bar'
                                    placeholder='Search'
                                    value = {searchInput}
                                    onChange={this.searchResult}
                                />
                                <AiOutlineSearch size={40} />
                            </div>
                            <button type="button" className='connect-btn' >Connect</button>
                        </div>
                        <p className='mc-text' >{headText}</p>
                    <div className='card-container' >
                            {
                            tokensList.map((pair, idx) => (
                                <Card key={idx}
                                symbol={pair.baseToken.symbol}
                                dexId={pair.dexId}
                                pairAddress={pair.pairAddress[0] + pair.pairAddress[1] + pair.pairAddress[2] + pair.pairAddress[3]}
                                name={pair.baseToken.name}
                                symbol_base={pair.baseToken.symbol}
                                address_base={pair.baseToken.address[0] + pair.baseToken.address[1] + pair.baseToken.address[2] + pair.baseToken.address[3]}
                                name_quote={pair.quoteToken.name}
                                symbol_quote={pair.quoteToken.symbol}
                                address_quote={pair.quoteToken.address[0] + pair.quoteToken.address[1] + pair.quoteToken.address[2] + pair.quoteToken.address[3]}
                                price_native={pair.priceNative}
                                priceUSD={pair.priceUsd}
                                pairCreatedAt = {pair.pairCreatedAt}
                                />
                            ))
                            }
                    </div>
                    </div>
            </div>
        )
    }
}
export default Home