import { defineWalletSetup } from '@synthetixio/synpress'
import { MetaMask, getExtensionId } from '@synthetixio/synpress/playwright'
import 'dotenv/config'

const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = process.env.WALLET_PASSWORD
const DAPP_URL = process.env.DAPP_URL

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  // This is a workaround for the fact that the MetaMask extension ID changes.
  // This workaround won't be needed in the near future! 😁
  const extensionId = await getExtensionId(context, 'MetaMask')

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)

  const page = await context.newPage()

  // Go to a locally hosted MetaMask Test Dapp.
  await page.goto(DAPP_URL)

  await page.locator('.css-f6qq6g').click()

  await metamask.connectToDapp(['Account 1'])
})
