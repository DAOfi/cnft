import axios from 'axios'
import { Contract, ethers } from 'ethers'
import CNFT from '../artifacts/contracts/CNFT.sol/CNFT.json'
import { expandTo18Decimals } from '../test/shared/utilities'

const zero = ethers.BigNumber.from(0)
const divisor = ethers.BigNumber.from('10000000000000000')
const threshold = expandTo18Decimals(1)
const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

async function getGasPrice() {
  return (
    await axios.get(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.API_KEY}`
    )
  ).data.result.FastGasPrice // ProposeGasPrice
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSONRPC_URL || 'http://localhost:8545'
  )
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider)
  const walletAddress = ethers.utils.getAddress(wallet.address)
  console.log('Wallet:', walletAddress)
  // Get DAOfi ABI
  const daofiAbi = (
    await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=0xD82BB924a1707950903e2C0a619824024e254cD1&apikey=${process.env.API_KEY}`
    )
  ).data.result
  const daofiToken = new Contract(
    '0xD82BB924a1707950903e2C0a619824024e254cD1',
    daofiAbi,
    wallet
  )
  console.log('DAOfi token:', daofiToken.address)
  const cnftToken = new Contract(
    '0x8e2B4badaC15a4ec8c56020f4Ce60faa7558c052',
    CNFT.abi,
    wallet
  )
  console.log('CNFT token:', cnftToken.address)

  const blacklist: any = {
    '0xD82BB924a1707950903e2C0a619824024e254cD1': 'DAOfi Token',
    '0xF647830Cbd601eA7B6a3C1B38Cf037f31AB6Ce79': 'DAOfi Uniswap',
    '0x8e2B4badaC15a4ec8c56020f4Ce60faa7558c052': 'CNFT token',
    '0xBDD75B461106896F626385B63aE65e6BeD0003D9': 'ZBG',
    '0x562680a4dC50ed2f14d75BF31f494cfE0b8D10a1': 'Hotbit',
    [walletAddress]: 'Communifty wallet', // CNFT wallet
  }
  const claimable: any = {
    '0x01F5C0f245756A7563707512315F1b72A34Ec213': true,
    '0x0Be82FB1dD8f45C48C551868B776815b4655914F': true,
    '0x102CF3B045cA75514dA84852d50aa9FEc4b5EE0A': true,
    '0x14cbF53497D7228091eF712dbbff05448fcc2b3C': true,
    '0x14eBE883a1a8B5b8Ed3D419Fcd74aD3918c23C42': true,
    '0x1ccd8ff59612d4108d9bbe5f16add545efc6fdbe': true,
    '0x1deb54770e792ea202ae5dcdc76dafa39db5357d': true,
    '0x25D9EDfEbcd431723D5c5cf9Bf33D9D2ecBdB85F': true,
    '0x285Ac7F8A3bcbC60E6baCbBEaFfC5c75D8Abb0A6': true,
    '0x28943316917199Be87A090E487Eb4795194A91a2': true,
    '0x2a52b0050459cC4e9c1B50D8e0826755a9Fa3326': true,
    '0x2bA117929C3c53ac7C38AD870321573c740Cf139': true,
    '0x3F20E0245eF51b770a4eE6929d87A9041f61EBa5': true,
    '0x42147EE918238fdfF257a15fA758944D6b870B6A': true,
    '0x4233168fe150776bA6f8CDA98c90411b54551502': true,
    '0x424586aC637823e529e5969Cf0729044272cB50e': true,
    '0x454eFe906cf378eA6674c8292Fd7142948192a3D': true,
    '0x4851E00c3fEc6F47c48ABBE989F31E70C6173280': true,
    '0x4cE44060451857eC81254Aa6181A8ec65F8DdfB9': true,
    '0x543a4a8C551e6c81b03FDeA63aB52444Cb2C24BF': true,
    '0x589961f5eC8E8bBe3e35E435eCfe2eAca2Fc997c': true,
    '0x59BA08a00f86817F6FF80b590E046826Ae2e9bc7': true,
    '0x61580AB72e647f32BBb1939abDC7C0De49371A08': true,
    '0x62b325c7Ad8719f8d224cf53101326c7B9c8261e': true,
    '0x68C0F043Fb61F1be7e6F087033Ddf92b9Cd02de7': true,
    '0x6a5dBF2Fb5206EC8192620810C3edB6d5e62B188': true,
    '0x6d8F46649ECAe78e8B31f2Ea928021Ad6aDd2771': true,
    '0x6E6faFFA8B6D236fd9e5Cef0CC6b36e7ad6705E3': true,
    '0x70Fb53E5a46dCc1CBbf2e8d860410c17EA2382f1': true,
    '0x750D23ea18E1737C17cd517aEA97CF8F48e0B218': true,
    '0x7710a249C9A386B3b13ADE6a42059feCaea26F11': true,
    '0x782A16fe03a7F8138349B57428aAf824B0e7e71D': true,
    '0x7d1b68ae2665b99369e39e6bc722c127f24efeb7': true,
    '0x7D612D48360BdB93F5e4c99555152682314957f8': true,
    '0x7f21A85B1A31F85b94767EB0C204eB22a060a3f4': true,
    '0x7f8EAe8874af0B351ae3923b2cAA8ecB79b847B7': true,
    '0x812D0401CC41cEEFe38F3e1221994DcDEd8f6064': true,
    '0x827A9F0ce01C07B723293f6D48aAA529a210AF80': true,
    '0x855d34991980Fc30C5dD27E0f98170D3beA800a1': true,
    '0x891bAD61014e35395474A260B58BB6dF4fD8991B': true,
    '0x8a5748A3a7105c4296550C5f3a424693EE2df43d': true,
    '0x8E28934e53bd18A5abE82C6b6Dd8c46d640B0768': true,
    '0x8Fe9C787995D12b6EF3a9448aA944593DaC93C6c': true,
    '0x94F1029fA7338f220adf6c2f238C3D0AbA188Be8': true,
    '0x96481CB0fCd7673254eBccC42DcE9B92da10ea04': true,
    '0xA1a3e7a050cAc80624F6811B246df57fb929d240': true,
    '0xA21392dD4b12CB543Fb6d1e4e8759B3AC6e55169': true,
    '0xA2dCB52F5cF34a84A2eBFb7D937f7051ae4C697B': true,
    '0xa40c8Ac5A6a06f65c0C24A8Db87466383a0A684A': true,
    '0xa966f733C33Ac8B96d832DF06478b01D9fdF3b6F': true,
    '0xAA8E04AB3E3CCC898253A2F849b8da842942c8fE': true,
    '0xaaAe7829176b3750D753F098fC5a9f0EBcAdbff1': true,
    '0xab9b81AAdD04e7cf16057f0fA492729AD61d70be': true,
    '0xAd145741B1E0321305f9a6E95B347610014aEb5d': true,
    '0xaf5bf837001dc20fd3223209c7825893ce63a4cb': true,
    '0xb85d4fB0dA81a439194c9D946d1F70876f0a7378': true,
    '0xbBcf68Fcf6F21FD55aed5ea065D3279f2C5221f3': true,
    '0xc00dA2A27c2842fE2BaBBe5F9cD02D895C75fa18': true,
    '0xC493756Aa0f4632F827eFb31107a2345c416b7e4': true,
    '0xC4a4F81cF5Cbf3363099Df8e75C728EBa026F8C8': true,
    '0xC6dDF90790b433743bd050c1D1d45f673A3413F4': true,
    '0xC89Ea82A3D8Dd893014BA1378c04c46F6534C859': true,
    '0xcD815B9302bC6a828294CE6aa7C353B206997A4e': true,
    '0xcEB67F72BF199Ed6FAabD7b6BAf3D0Eb44143160': true,
    '0xd18c20FC319412F72c973B6F8b1933A1f81517FC': true,
    '0xD266d61ac22C2a2Ac2Dd832e79c14EA152c998D6': true,
    '0xD48E141BDB9c49E9Ef5E98d91822135422173109': true,
    '0xd4CA95F7139508D822e4FC16d4F1466E1ABDD36C': true,
    '0xDA5FAF0305eB815232fcFfd14931cB7f47f65d0a': true,
    '0xdc31dF63ca0b6DE64Bc62d81844e8956D2476541': true,
    '0xdeCa63c36E47FA3EB53a25cb4a802b3d6dFd095b': true,
    '0xdeCa7aD57C25CF2eF32eCf184979561B186EAf94': true,
    '0xdFEDdfEdbc01d2e3dE2aD26ff48505fA50A83C51': true,
    '0xE044a6E035d13D8312d64608E6Fe765a9fcDDAa7': true,
    '0xE1986d5Ed7d002C8B106De92f7469fb82200d4D8': true,
    '0xE2b0aD9f3789ef0adf1610799EE7ed5aC8053C8e': true,
    '0xE715dB8ffe482ABb39a4594294d1632F35Db77e8': true,
    '0xe9a99d1d1a3F1F166b53596B31EBaE0083C5d058': true,
    '0xEB8888781Db99Ad53423d03366d58B6404Bcd506': true,
    '0xEE338A4307544F7AC4E8569311DCCB7FCC59A00D': true,
    '0xeF7cFd3A5a1a9ddD3F4582f14B9A98B3e86eDED1': true,
    '0xf0f79a39b0026263ac700e58ebe7023280a3a57a': true,
    '0xF8Ad2c3f153c1f9587643Ba3698A284D32F9CF6E': true,
    '0xffECC69712410da606A4a5666836dE5F1D335795': true,
    '0x0525Aac399a1f42546ab90a043C35B6FC2682c87': true,
    '0x071559131A549817ee2307d22eD7524f8957D0E1': true,
    '0x08485d52eb222caa61eb8c56d936693002646f97': true,
    '0x0ad55Adc930d142496f2a46358Fa7306A6295763': true,
    '0x0C2928630395EA989e3077Aefe50E08dc5426584': true,
    '0x0df7c50580df4adE43A1A4Cc23a175313e47782a': true,
    '0x0E51631F1E21bD22C591de48B273dF6139D89Ea7': true,
    '0x0EFA138A27FB6A388B1498680759DB5990D844B1': true,
    '0x10b812498A8E6f82223Fd2B2B1E4e17f4D847f62': true,
    '0x118DDD52B51FAfC71f5F67A44ab97a2B567De5A6': true,
    '0x17ec047622C000Df03599026A3B39871EC9384DB': true,
    '0x1A4D2f4d0db6ABdE8345195Cf6cbA7226048C8b3': true,
    '0x1a8dd759DBE9c791c620E8A7D4B119493815DfDB': true,
    '0x1D12d09793DAF5eB834C8d29Eb6A039C32b73813': true,
    '0x266ACBfDb8547E028f9499766138C7d1fa87bF37': true,
    '0x27CA52818a435fd3A949fbB4CE7aaCb8Ce19d4d6': true,
    '0x2B219526EAF964D680738D411f1434A8AFAf092d': true,
    '0x2ee27560eDD8c4c74c6C4660c5f6ca9347D2fcC2': true,
    '0x305F4900F5dA9c2275EBea12efB4e1B9495d5ed3': true,
    '0x32677679A5a7BDE28C17dfa40918342c3E561F29': true,
    '0x334a0095dFac779F62Dd79993E4020D2Fa164E11': true,
    '0x36c1Fc4eDAe247a8ede5843da3f0f40aA6e11078': true,
    '0x3781f247C84d86217A17b95F6457c9BfA1212a4B': true,
    '0x39E653934158C67518C38B945d2838B388B30149': true,
    '0x39E8754a01604b157a8bFcD217a188AAF48b7065': true,
    '0x3daeeaEd44484d6695243Cc0f4356ccBcf911A46': true,
    '0x3E2301079D6CC17a40Dc6604472b331571f98C68': true,
    '0x3e91d9469de69d3c0eef04A1ACB6f61DE4E4fd7c': true,
    '0x442bf1bE2027b1Fe41E31DC72D97932e11d081F1': true,
    '0x4A4f1C998b89C0dC000983FFd997420Dad282ca1': true,
    '0x4eA4FDd8C8C296EcE8417539a156E728b6908734': true,
    '0x4ec45d81244d69063481425BBa0ee237A1D074Ce': true,
    '0x4ffC250D482c5197EEb15A12Dc206BC1dD0ecFCb': true,
    '0x5185368476d5A2571F97B27EcfB068a0b8F1e9DB': true,
    '0x53D1Ef75673917ba05eA967f218140774Afe1dc3': true,
    '0x566f7FF41F53ed37be34ad05B64DC766510F4147': true,
    '0x57cdCc7B83664ACfbf5CBd5C561A2801289c8373': true,
    '0x60009Db9bfB770684Dc949D3A1b6A8b8A1788c45': true,
    '0x60909105dd04082EA85184642b756611E411c837': true,
    '0x61f91118E8Fcd8a9b3eaF3D60097391AE9E76d15': true,
    '0x6aB023F9a356D40b0bE4085B3ad194624b3e2465': true,
    '0x6cC77465823260A74d9586D816cbE993F0A43229': true,
    '0x703a420c219924025f8D4D1eA9c2f8DF764111aB': true,
    '0x76F7280904158672Ed026CD1ed76aa19e86f9dBF': true,
    '0x76f8046B01317042Eedd021F8F596d7D38215713': true,
    '0x7Adf0735f784DBC6813525D19204d77b3B305EDC': true,
    '0x7E80E83C56089d01D0E1F4D77B60359baBCe91b6': true,
    '0x8030E5f5914C5cCF1b930b20d90687DECcB1B7C9': true,
    '0x812a8c7223A98B08c3DFC41Ab9300013A4A21703': true,
    '0x887dac1bdd710c35e9f4f0f89a786b32526aefc7': true,
    '0x8dA1dBECa9F637fD5ee5D44a017b2E54ED235255': true,
    '0x8E0b502c2B7bf90958e9Cb079B1B4e7C66Df7E8C': true,
    '0x986784d717850caE62351FF62D3C7101cBb7e9DA': true,
    '0x9964F2eF05B584a9C43F076DB78796E09ae2d225': true,
    '0x9a0e0e45653873138bdd258453e7b10712e111e6': true,
    '0x9a1Eb5Ed1cd1e7C457EF4D82f90706F2abEFA19b': true,
    '0x9b6AD928912bF1b4842630A9Ab0531c7ecaEb3f0': true,
    '0x9f8b04f57Bf3702B87B91fB570b5D9D3D505486f': true,
    '0xa4407d04b0F20a87a78D1b51A005Dbebb30896D6': true,
    '0xAE92ef09313A6229b51E90507b9ef40eC35101A2': true,
    '0xBacEcAc3EA45372e6a83C2B97032211e4758368a': true,
    '0xbca0CdBdcA5134DF5D94d4Dc7721Fa5cF1ED1063': true,
    '0xbCc4c180beB3A89CD85ED18E0432BC635bec8Ff5': true,
    '0xBdA6C6fF24b4cc24d705DD65AA2FfE81D06f7AF2': true,
    '0xBdEDd3A331a58EfAb74c70a7A1E2305eFefce8c1': true,
    '0xC19F1FDF07EA0A38FF67500190236FE78A3FAEC6': true,
    '0xC23474798ACc8213b7d676289385815F308DF58f': true,
    '0xc27e16501c237F9C67c3f40bbF56158BC839725B': true,
    '0xC5489853994Ba3CcB05835C5c5c8c3B71929Eb6A': true,
    '0xc883BC44F7ca2A172f8f840c6a8F0F506049C38a': true,
    '0xCBE1d6aBb917bd7b5fAF43123e9De58D4462200C': true,
    '0xCF85796Ae809C2E03FDFb263eE7A243DebDA474e': true,
    '0xd43a2291e8b9a79A7634b040CAe3668ACf08d840': true,
    '0xdA8E5a36c2BAE9812614d504594af17B2B54f2BF': true,
    '0xDaA926338bA4e0FE5aa63490a416af5b190095c9': true,
    '0xdd5a1c148ca114af2f4ebc639ce21fed4730a608': true,
    '0xDD6749874D023A862bfA6a6ED180d401B929B3e7': true,
    '0xe27642e6B740d6Efce4443DaC8db2f54c9ed3A11': true,
    '0xE343626808DF5BA9351Eccc3109d54C1898bCBba': true,
    '0xe407Ed73960464dD8b3fbdE46d9B83dF68b04A04': true,
    '0xe6735CD72B819c2Cc3CdB710a123f8FE32E596AD': true,
    '0xe7AfD81D7857f582d9f437cF7AAA9b9A931Bf7fA': true,
    '0xed533e55142e13ceBe23B0C01791ce0e49b01Fe9': true,
    '0xEE96297d6645cd5D78CAD54B931EE0cDed7943C9': true,
    '0xeEe78cC7dB61907a75cA0A737794BeB5e076f740': true,
    '0xEEff483b297016938400575043752A2d10d7579A': true,
    '0xf11AF8CEd69362bE9BB3DA245B2eC6E5B309D2EF': true,
    '0xF4dEB0Fa5FA3a703E444a0a49500F11ACfdD4421': true,
    '0xfa465069B477164FECDfcdEA523308894224E926': true,
    '0xfb17199BB361dAED5B8dF4E0d263f2f6CB990C50': true,
    '0x2a8a6bf0e15B25bd07740f339471941cF7710223': true,
    '0x879063a9069bBf56013142A93F73b63F3EbB2108': true,
    '0xD4d8D9Bca02A8Df7bF9323a359b03d48A05251A4': true,
    '0x5080FdA2a93078DED890D8591AeBCEA7F345c492': true,
    '0x6ca078cf9a3e824FE694B1d902261eeB89d2AB4b': true,
    '0x5dBE35e482b6e7c688bc1f0c2A23169c067351C0': true,
    '0xedF7DdF04E89CEeE5d49317A5f218c71cE4793FB': true,
    '0xAbeEcb05799E2a5d5e996D92cCA18a498a82b5b0': true,
    '0x5cBbc67EC79A94ccc3D6c122397036e69DaA9F17': true,
    '0xB28F2d789e9dae9fccFf7e810a846f4b42A29C12': true,
    '0x7ece54814110f5b5B161106fC24333338156D249': true,
    '0x047Fc4D26905B96D489371080dC878f2574155eD': true,
    '0x82339C9D5DCE885988C249d3F54Ee4701aDB3477': true,
    '0xf9263986bE319E0444B600a73501Ef7689cDB022': true,
    '0xaFD6A3A28bDbed19B8606bF6C578EA8A67ab7778': true,
    '0x3177228dB4291735867aE7Ab1CFb16806a334efD': true,
    '0x77DFc4a419D072fBFa66209595006a90441F97f6': true,
    '0x43552895d88b5fC5308c098388483dD673629ad4': true,
    '0x4b80e19015458C87805E96Be9298487D3A09Fc35': true,
    '0x6c54B937b5e1bDf5e670F842AE9aFd056Bb4A6d6': true,
    '0x51d9846D56cf35718C6Be161EBc84E2dCE0a36f0': true,
    '0x00064e885741Ed13A122C5A115999e05c71B8FCa': true,
    '0x0Aa546A6a0bf33f839c520189b4811F4318e2152': true,
    '0x10Ac093411Ab176Af22CAaB884910E8c4B087640': true,
    '0x160e5F4125e1A97778BC083E2E0dB218595b035c': true,
    '0x165C51c36A28e9e1aB321243820DB6CcA6842034': true,
    '0x172aAf9628EEDd8A074B1B16303f1b910E2bB077': true,
    '0x23C0954C4b997c58A1544717dE90C8E174eA194c': true,
    '0x24eD0FC5F7Ab884887e79160694ED7bDe1ABb6C5': true,
    '0x257a24317A73a570789A6291A7e29EFe2820eE63': true,
    '0x2bC98b4e3E2FaA72aD581cd3CBC48518a6570639': true,
    '0x2D69BAB9738b05048be16DE3E5E0A945b8EeEf3a': true,
    '0x331526f9bd3c6B3037bb4e771876Fcd1AC266306': true,
    '0x3c5829BfE6137a28455b575D0Ed56e7b4707B56b': true,
    '0x3D91172dc4F08c3fF66308110C5c7A5Ad25f3D31': true,
    '0x4553eD5d8d3731E629f67BD86abd021175F31848': true,
    '0x4a5BB1c9347A0d4F7e06a29239162f03647d9232': true,
    '0x50770e3A529475509880F0dA1b0B67a2E03cBFC0': true,
    '0x52503cd057090d826b455a07620c9501bd590310': true,
    '0x54efA46a5a94e3Ee496C703B90ac487A39B5260e': true,
    '0x557a078023680b289E5EF02247BdD26FD301aa0a': true,
    '0x6d16749cEfb3892A101631279A8fe7369A281D0E': true,
    '0x78d8e8807f652b54afe33b7645a26c5ffae5291c': true,
    '0x7C0b530DF1EB8a7de7cbE9fD16762d0ca9150d93': true,
    '0x8017Ff21bc4972d84a4dfFf2141517dAeFD0c256': true,
    '0x8b5D50c9A80586F728820d52b10a57f082577f1f': true,
    '0x8d4DE035D3f696682B503c8D022D3e4f7F550C91': true,
    '0x8fAF97b6692F3058f36d99373407aD9e573a774C': true,
    '0x98B728c7b4153ABF7D738dd59DbB3DD328e05Ea3': true,
    '0x9B68CEd9a7D1881E3E0d1A0f2833916CD9136FE9': true,
    '0xa560584b1c24783135813c6D898BdF89d7D7Dc12': true,
    '0xabBF80801092C40dFdBA8019c63C61aB3e63556A': true,
    '0xad28be2059e305756124ca716164a76c71d9b93f': true,
    '0xAd4DfAA11bCaeE1d41B3dCD1B547d295F4782a94': true,
    '0xae9db1ff69cfca2720ff2e5d81807d7383138a39': true,
    '0xaF500C977B5540D54A9C96001EAF413EEC19AFC6': true,
    '0xB0298f7018a2A77768e110FA75570B6A58B8274C': true,
    '0xb25B1499BDBEB5A23653798364FaeC4eE464867f': true,
    '0xb37ee583384771678cfD7b2C75DA6e72Cae5069e': true,
    '0xBBe8781865130eC7fD21FfeCb0fc05632cf0E04B': true,
    '0xbe535c49d8e65DA9cd9a809A3D59248A89A2496B': true,
    '0xC3D8FE03835295f95e4fB99F80d41A0A5a70d7a1': true,
    '0xCBE203901E2F3CA910558Efba39a48Af89e3c558': true,
    '0xCD686F51Ae7f9C51fA93C78Ddd02a459D8a69d20': true,
    '0xd03F3e6C1B7272aa1F2336C1856a74d759fd0A6A': true,
    '0xd8CeF0eEbfb79EDD5D85840d68Ff241a59DD147a': true,
    '0xdd9d45add53897ea9ae20770edf8cdfb7ca35332': true,
    '0xe1156Ae45B025EcC696fE74d7Fc33AfEF1ca624E': true,
    '0xE9e86e179f6376089A4371fAcB3e7879a003DC1c': true,
    '0xEF4DB83FfB10495dcb817f2F170Ad3d6Bd0ced3D': true,
    '0xF475E7dB2e3B7878F44f8347EfD6fcf5Cb7FcF93': true,
    '0xF7b78b15Af7740116E90880c90720741A79427e1': true,
    '0xFA839a19873D5fef377b8F59093976A1D575aeE5': true,
  }
  const mapping: any = {}
  const whitelist: any = {}

  const snapshotBlock = 12941669
  const incBlock = 10000
  let startBlock = 11050500
  let endBlock = startBlock + incBlock

  // Collect all transfer recipients
  console.log(`Processing blocks ${startBlock} to ${snapshotBlock}`)
  while (startBlock !== snapshotBlock) {
    let logs =
      (await daofiToken.queryFilter(
        daofiToken.filters.Transfer(),
        startBlock,
        endBlock
      )) || []

    for (let event of logs) {
      const to = event.args ? event.args['to'] : null
      if (to && !whitelist.hasOwnProperty(to)) {
        whitelist[to] = true
      }
    }

    startBlock = endBlock
    endBlock = startBlock + incBlock

    if (endBlock > snapshotBlock) endBlock = snapshotBlock
  }

  // Process holder balances
  let addresses = Object.keys(whitelist)
  let airDroppedSupply = zero

  console.log(`Holder whitelist has ${addresses.length} potential addresses`)

  for (let address of addresses) {
    const balance = await daofiToken.balanceOf(address, {
      blockTag: snapshotBlock,
    })

    if (blacklist.hasOwnProperty(address)) {
      console.log(
        'BLACKLISTED',
        blacklist[address],
        address,
        balance.div(divisor).toNumber() / 100
      )
      delete whitelist[address]
      continue
    }

    // Support mappping holder to recipient addresses for exchange wallets
    const recipient = mapping.hasOwnProperty(address)
      ? mapping[address]
      : address

    if (
      balance.gt(threshold) &&
      (await cnftToken.balanceOf(recipient)).eq(zero)
    ) {
      if (process.env.LIVE_RUN === 'true') {
        try {
          // transfer holder balance
          const gasPrice = await getGasPrice()
          const tx = await cnftToken.transfer(recipient, balance, {
            gasLimit: 2e5,
            gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
          })

          await tx.wait()
          console.log(
            tx.hash,
            address,
            recipient,
            balance.div(divisor).toNumber() / 100
          )
        } catch (e) {
          console.log(
            'ERROR',
            address,
            recipient,
            balance.div(divisor).toNumber() / 100,
            e
          )
        }
      } else {
        // simulate tx
        await sleep(2000)
        console.log(
          '0x0',
          address,
          recipient,
          balance.div(divisor).toNumber() / 100
        )
      }

      airDroppedSupply = airDroppedSupply.add(balance)
    } else {
      delete whitelist[address]
    }
  }

  const holderSupply = airDroppedSupply.div(divisor).toNumber() / 100
  console.log(
    `Airdropped ${holderSupply} to ${
      Object.keys(whitelist).length
    } holder addresses`
  )

  // Process claimable balances
  addresses = Object.keys(claimable)
  airDroppedSupply = zero

  console.log(`Claimable whitelist has ${addresses.length} potential addresses`)

  for (let address of addresses) {
    const balance = await daofiToken.claimable(address, {
      blockTag: snapshotBlock,
    })

    if (blacklist.hasOwnProperty(address)) {
      console.log(
        'BLACKLISTED',
        blacklist[address],
        address,
        balance.div(divisor).toNumber() / 100
      )
      delete claimable[address]
      continue
    }

    if (
      balance.gt(threshold) &&
      (await cnftToken.balanceOf(address)).eq(zero)
    ) {
      if (process.env.LIVE_RUN === 'true') {
        try {
          // transfer claimable balance
          const gasPrice = await getGasPrice()
          const tx = await cnftToken.transfer(address, balance, {
            gasLimit: 2e5,
            gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
          })

          await tx.wait()
          console.log(tx.hash, address, balance.div(divisor).toNumber() / 100)
        } catch (e) {
          console.log(
            'ERROR',
            address,
            balance.div(divisor).toNumber() / 100,
            e
          )
        }
      } else {
        // simulate tx
        await sleep(2000)
        console.log('0x0', address, balance.div(divisor).toNumber() / 100)
      }

      airDroppedSupply = airDroppedSupply.add(balance)
    } else {
      delete claimable[address]
    }
  }

  const claimerSupply = airDroppedSupply.div(divisor).toNumber() / 100
  console.log(
    `Airdropped ${claimerSupply} to ${
      Object.keys(claimable).length
    } claimer addresses`
  )
  const remainingSupply = await cnftToken.balanceOf(walletAddress)
  console.log(
    `Creator ${walletAddress} holds remaining supply of ${
      remainingSupply.div(divisor).toNumber() / 100
    }`
  )

  if (process.env.LIVE_RUN === 'true') {
    // Transfer remaining supply to cold storage
    const gasPrice = await getGasPrice()
    const tx = await cnftToken.transfer(
      '0xCF5B119b5A985C9B9bE503df195B66735bE3E8D4',
      remainingSupply,
      {
        gasLimit: 2e5,
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
      }
    )

    await tx.wait()
    console.log(
      tx.hash,
      `0xCF5B119b5A985C9B9bE503df195B66735bE3E8D4`,
      remainingSupply.div(divisor).toNumber() / 100
    )
    const storageSupply = await cnftToken.balanceOf(
      '0xCF5B119b5A985C9B9bE503df195B66735bE3E8D4'
    )
    console.log(
      `Cold storage 0xCF5B119b5A985C9B9bE503df195B66735bE3E8D4 holds remaining supply of ${
        storageSupply.div(divisor).toNumber() / 100
      }`
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
