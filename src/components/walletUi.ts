import { sequence } from "0xsequence";
import { AFrame, ComponentDefinition } from "aframe";

interface IWalletUi {

}



interface IWalletEventProps {
    wallet: sequence.provider.Wallet,
    state: 'connected' | 'disconnected'
}

type WalletEvent = CustomEvent<IWalletEventProps>

export type WalletUi = ComponentDefinition<IWalletUi>



const walletUi: WalletUi = {
    schema: {

    },
    init: function () {
        
    }
}

interface ISequenceWalletProps{
    wallet?: sequence.provider.Wallet
    tryConnect: () => Promise<void>
    displayConnected: () => Promise<void>
    disconnect: () => Promise<void>
}


const sequenceWallet: ComponentDefinition<ISequenceWalletProps> = {
    init: function() {
        const wallet = new sequence.Wallet()
        this.wallet = wallet
        if(wallet.isConnected()) {
            this.displayConnected()
        }
    },
    displayConnected: async function () {
        const address = await this.wallet?.getAddress()
        this.el.setAttribute('text', {
            value: address?.substring(0, 6) + '...'
        })
    },
    tryConnect: async function () {
        try {
            await this.wallet?.connect()
            const evtProps: IWalletEventProps = {
                wallet: this.wallet!,
                state: 'connected'
            }
            this.displayConnected()
            console.log(this.wallet!.isConnected())
        } catch (error) {
            console.log("wallet connect error")
        }
    },
    disconnect: async function () {
        this.wallet?.disconnect()
        this.el.setAttribute('text', {
            value: 'Connect Wallet'
        })
    },
    events: {
        click: function (evt: CustomEvent<any>) {
            const elem = evt.detail.intersection.object.el.components['wallet-sequence'] as ComponentDefinition<ISequenceWalletProps>
            console.log(elem.wallet?.isConnected())
            if(elem.wallet?.isConnected()) {
                elem.disconnect()
            } else {
                elem.tryConnect()
            }
        }
    },
   

}

AFRAME.registerComponent('wallet-sequence', sequenceWallet)