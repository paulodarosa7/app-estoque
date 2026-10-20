import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { movimentacaoApi } from '../api/api';
import { Produto, TipoMovimentacao } from '../types';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => void | Promise<void>;
}

export function FormularioMovimentacao({
  produtos,
  onMovimentacaoCriada,
}: Props) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao | ''>('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const bloqueado = salvando || produtos.length === 0;

  async function handleSubmit() {
    if (salvando) return;

    setErro('');
    const quantidadeInformada = quantidade.trim();

    if (!produtoId || !tipo || !quantidadeInformada) {
      setErro('Preencha todos os campos: produto, tipo e quantidade.');
      return;
    }

    const produto = produtos.find((item) => String(item.id) === produtoId);
    if (!produto) {
      setErro('Selecione um produto válido.');
      return;
    }

    const quantidadeNumero = Number(quantidadeInformada);
    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    setSalvando(true);

    try {
      await movimentacaoApi.criar({
        produtoId: produto.id,
        tipo,
        quantidade: quantidadeNumero,
      });
      setProdutoId('');
      setTipo('');
      setQuantidade('');
      await onMovimentacaoCriada();
    } catch (err: any) {
      setErro(err.response?.data?.message ?? 'Não foi possível registrar a movimentação. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Nova Movimentação</Text>
      <Text style={styles.label}>Produto</Text>
      <View style={styles.seletor}>
        <Picker
          selectedValue={produtoId}
          onValueChange={(value) => setProdutoId(String(value))}
          enabled={!bloqueado}
          accessibilityLabel="Produto da movimentação"
          style={styles.picker}
        >
          <Picker.Item label="Selecione um produto" value="" />
          {produtos.map((produto) => (
            <Picker.Item
              key={produto.id}
              label={`${produto.nome} — estoque: ${produto.quantidade} un.`}
              value={String(produto.id)}
            />
          ))}
        </Picker>
      </View>
      {produtos.length === 0 ? (
        <Text style={styles.aviso}>Cadastre um produto antes de registrar movimentações.</Text>
      ) : null}

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.seletor}>
        <Picker
          selectedValue={tipo}
          onValueChange={(value) => setTipo(value === 'ENTRADA' || value === 'SAIDA' ? value : '')}
          enabled={!bloqueado}
          accessibilityLabel="Tipo da movimentação"
          style={styles.picker}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Entrada" value="ENTRADA" />
          <Picker.Item label="Saída" value="SAIDA" />
        </Picker>
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        accessibilityLabel="Quantidade da movimentação"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
        editable={!bloqueado}
      />
      {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
      <TouchableOpacity
        style={[styles.botao, bloqueado && styles.botaoDesabilitado]}
        onPress={handleSubmit}
        disabled={bloqueado}
        accessibilityRole="button"
        accessibilityState={{ disabled: bloqueado, busy: salvando }}
      >
        <Text style={styles.botaoTexto}>{salvando ? 'Registrando...' : 'Registrar movimentação'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', marginBottom: 8 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8, overflow: 'hidden' },
  picker: { width: '100%', minHeight: 44 },
  aviso: { color: '#666', marginBottom: 8 },
  erro: { color: '#b91c1c', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
