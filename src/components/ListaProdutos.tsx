import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ListaProdutos({ produtos }: Props) {
  return (
    <View>
      <ScrollView horizontal contentContainerStyle={styles.conteudoHorizontal}>
        <View style={styles.tabela}>
          <View style={[styles.linha, styles.cabecalho]}>
            <Text style={[styles.celula, styles.id, styles.celulaCabecalho]}>ID</Text>
            <Text style={[styles.celula, styles.nome, styles.celulaCabecalho]}>Nome</Text>
            <Text style={[styles.celula, styles.categoria, styles.celulaCabecalho]}>Categoria</Text>
            <Text style={[styles.celula, styles.preco, styles.celulaCabecalho]}>Preço</Text>
            <Text style={[styles.celula, styles.estoque, styles.celulaCabecalho]}>Estoque</Text>
          </View>
          {produtos.map((produto) => (
            <View key={produto.id} style={styles.linha}>
              <Text style={[styles.celula, styles.id]}>{produto.id}</Text>
              <Text style={[styles.celula, styles.nome]}>{produto.nome}</Text>
              <Text style={[styles.celula, styles.categoria]}>{produto.categoria.nome}</Text>
              <Text style={[styles.celula, styles.preco]}>{moeda.format(produto.preco)}</Text>
              <Text style={[styles.celula, styles.estoque]}>{produto.quantidade} un.</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {produtos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteudoHorizontal: { flexGrow: 1 },
  tabela: { flexGrow: 1, minWidth: 560, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, overflow: 'hidden' },
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 8 },
  cabecalho: { backgroundColor: '#f5f5f5' },
  celula: { paddingHorizontal: 4, color: '#1f2937' },
  celulaCabecalho: { fontWeight: '600' },
  id: { width: 40 },
  nome: { flex: 2, minWidth: 144 },
  categoria: { flex: 1.4, minWidth: 112 },
  preco: { flex: 1, minWidth: 96 },
  estoque: { width: 80 },
  vazio: { color: '#666', paddingVertical: 16, textAlign: 'center' },
});
