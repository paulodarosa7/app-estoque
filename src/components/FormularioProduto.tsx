import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Categoria } from '../types';
import { produtoApi } from '../api/api';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => void | Promise<void>;
}

export function FormularioProduto({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (salvando || categorias.length === 0) return;

    const nomeInformado = nome.trim();
    const precoInformado = preco.trim();
    const quantidadeInformada = quantidade.trim();

    if (!nomeInformado || !precoInformado || !quantidadeInformada || !categoriaId) {
      setErro('Preencha todos os campos.');
      return;
    }

    const precoNumerico = Number(precoInformado.replace(',', '.'));
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(precoInformado) || !Number.isFinite(precoNumerico) || precoNumerico < 0) {
      setErro('Informe um preço válido, como 8,50, com no máximo duas casas decimais.');
      return;
    }

    const quantidadeNumerica = Number(quantidadeInformada);
    if (!/^\d+$/.test(quantidadeInformada) || !Number.isSafeInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
      setErro('A quantidade inicial deve ser um número inteiro maior ou igual a zero.');
      return;
    }

    const categoriaSelecionada = categorias.find((categoria) => String(categoria.id) === categoriaId);
    if (!categoriaSelecionada) {
      setErro('Selecione uma categoria cadastrada.');
      return;
    }

    setSalvando(true);
    setErro('');
    try {
      await produtoApi.criar({
        nome: nomeInformado,
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
        categoriaId: categoriaSelecionada.id,
      });
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId('');
      await onProdutoCriado();
    } catch (err: any) {
      setErro(err.response?.data?.message ?? 'Não foi possível cadastrar o produto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  const bloqueado = salvando || categorias.length === 0;

  return (
    <View style={styles.form}>
      <Text style={styles.titulo} accessibilityRole="header">Novo Produto</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Nome do produto"
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
        editable={!bloqueado}
      />
      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Preço do produto em reais"
        placeholder="Ex.: 8,50"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
        editable={!bloqueado}
      />
      <Text style={styles.label}>Quantidade inicial</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Quantidade inicial"
        placeholder="Ex.: 10"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
        editable={!bloqueado}
      />
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.seletor}>
        <Picker
          accessibilityLabel="Categoria do produto"
          selectedValue={categoriaId}
          onValueChange={(valor) => setCategoriaId(String(valor))}
          enabled={!bloqueado}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((categoria) => (
            <Picker.Item key={categoria.id} label={categoria.nome} value={String(categoria.id)} />
          ))}
        </Picker>
      </View>
      {categorias.length === 0 ? (
        <Text style={styles.aviso}>Cadastre uma categoria na tela Categorias antes de adicionar produtos.</Text>
      ) : null}
      {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled: bloqueado, busy: salvando }}
        style={[styles.botao, bloqueado && styles.botaoDesabilitado]}
        onPress={handleSubmit}
        disabled={bloqueado}
      >
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar produto'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  picker: { width: '100%' },
  aviso: { color: '#666', marginBottom: 12 },
  erro: { color: '#b91c1c', marginBottom: 12 },
  botao: { backgroundColor: '#2563eb', padding: 12, borderRadius: 6 },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
