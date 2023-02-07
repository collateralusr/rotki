import { Blockchain } from '@rotki/common/lib/blockchain';
import { type ComputedRef } from 'vue';
import { type BlockchainTotal } from '@/types/blockchain';
import { Section } from '@/types/status';
import {
  btcAccountsWithBalances,
  getBtcBreakdown,
  sum
} from '@/utils/balances';
import {
  type AssetBreakdown,
  type BlockchainAccountWithBalance
} from '@/types/blockchain/accounts';

export const useBtcAccountBalancesStore = defineStore(
  'blockchain/accountbalances/btc',
  () => {
    const { balances } = storeToRefs(useBtcBalancesStore());
    const { btc, bch } = storeToRefs(useBtcAccountsStore());

    const btcAccounts = computed<BlockchainAccountWithBalance[]>(() => {
      return btcAccountsWithBalances(
        get(btc),
        get(balances).BTC,
        Blockchain.BTC
      );
    });

    const bchAccounts = computed<BlockchainAccountWithBalance[]>(() => {
      return btcAccountsWithBalances(
        get(bch),
        get(balances).BCH,
        Blockchain.BCH
      );
    });

    const { shouldShowLoadingScreen } = useSectionLoading();
    const bitcoinTotals: ComputedRef<BlockchainTotal[]> = computed(() => [
      {
        chain: Blockchain.BTC,
        children: [],
        usdValue: sum(get(btcAccounts)),
        loading: get(shouldShowLoadingScreen(Section.BLOCKCHAIN_BTC))
      },
      {
        chain: Blockchain.BCH,
        children: [],
        usdValue: sum(get(bchAccounts)),
        loading: get(shouldShowLoadingScreen(Section.BLOCKCHAIN_BCH))
      }
    ]);

    const getBreakdown = (asset: string): ComputedRef<AssetBreakdown[]> =>
      computed(() => [
        ...(asset === Blockchain.BTC
          ? getBtcBreakdown(Blockchain.BTC, get(balances).BTC, get(btc))
          : []),
        ...(asset === Blockchain.BCH
          ? getBtcBreakdown(Blockchain.BCH, get(balances).BCH, get(bch))
          : [])
      ]);

    return {
      btcAccounts,
      bchAccounts,
      bitcoinTotals,
      getBreakdown
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBtcAccountBalancesStore, import.meta.hot)
  );
}
