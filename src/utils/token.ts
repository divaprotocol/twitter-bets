import { TOKEN_WITH_ICONS } from '../constant'

const getAssetImage = (asset: string, color: 'yellow' | 'green') => {
    if (TOKEN_WITH_ICONS[asset]) {
        return `./font-images/${TOKEN_WITH_ICONS[asset.toUpperCase()]}.svg`
    } else {
        const firstLetter = asset[0].toLowerCase()
        return `./font-images/alphabets-${color}/${firstLetter}_${color}.svg`
    }
}

// token : ETH/BTC
export const getUnderlyingTokenImage = (token) => {
    const referenceAssetTokenArray = token.toUpperCase().split('/')
    const firstTokenImage = getAssetImage(referenceAssetTokenArray[0], 'yellow')
    const secondTokenImage = getAssetImage(referenceAssetTokenArray[1], 'green')
    return [firstTokenImage, secondTokenImage]
}