import { getAddress, isConnected, setAllowed } from '@stellar/freighter-api';

export type WalletState = {
  isConnected: boolean;
  publicKey: string | null;
  error: string | null;
};

export async function checkWalletConnection(): Promise<WalletState> {
  try {
    const connected = await isConnected();
    if (!connected) {
      return { isConnected: false, publicKey: null, error: null };
    }

    const response = await getAddress();
    const publicKey = typeof response === 'string' ? response : response.address;
    return { isConnected: true, publicKey, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to connect to Freighter.';
    return { isConnected: false, publicKey: null, error: message };
  }
}

export async function connectWallet(): Promise<WalletState> {
  try {
    await setAllowed();
    const response = await getAddress();
    const publicKey = typeof response === 'string' ? response : response.address;
    return { isConnected: true, publicKey, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect wallet.';
    return { isConnected: false, publicKey: null, error: message };
  }
}
