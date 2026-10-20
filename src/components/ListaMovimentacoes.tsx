import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
}

function formatarData(data: string) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function ListaMovimentacoes({ movimentacoes }: Props) {
  return (
    <ScrollView horizontal contentContainerStyle={styles.conteudo}>
      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.data, styles.celulaCabecalho]}>Data e hora</Text>
          <Text style={[styles.celula, styles.produto, styles.celulaCabecalho]}>Produto</Text>
          <Text style={[styles.celula, styles.celulaCabecalho]}>Tipo</Text>
          <Text style={[styles.celula, styles.celulaCabecalho]}>Quantidade</Text>
        </View>
        {movimentacoes.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma movimentação registrada.</Text>
        ) : movimentacoes.map((movimentacao) => {
          const entrada = movimentacao.tipo === 'ENTRADA';

          return (
            <View key={movimentacao.id} style={styles.linha}>
              <Text style={[styles.celula, styles.data]}>{formatarData(movimentacao.criadoEm)}</Text>
              <Text style={[styles.celula, styles.produto]}>{movimentacao.produto.nome}</Text>
              <View style={styles.celula}>
                <Text style={[styles.tipo, entrada ? styles.entrada : styles.saida]}>
                  {entrada ? 'Entrada' : 'Saída'}
                </Text>
              </View>
              <Text style={styles.celula}>{movimentacao.quantidade}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { flexGrow: 1 },
  tabela: { flex: 1, minWidth: 560, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, overflow: 'hidden' },
  linha: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 8 },
  cabecalho: { backgroundColor: '#f5f5f5' },
  celula: { flex: 1, paddingRight: 8 },
  data: { flex: 2 },
  produto: { flex: 2 },
  celulaCabecalho: { fontWeight: '600' },
  vazio: { color: '#666', padding: 12 },
  tipo: { alignSelf: 'flex-start', fontWeight: '600', paddingVertical: 4, paddingHorizontal: 6, borderRadius: 4 },
  entrada: { color: '#166534', backgroundColor: '#dcfce7' },
  saida: { color: '#b91c1c', backgroundColor: '#fee2e2' },
});
