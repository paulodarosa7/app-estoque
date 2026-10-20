import { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Movimentacao, Produto } from '../types';
import { movimentacaoApi, produtoApi } from '../api/api';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { FormularioMovimentacao } from '../components/FormularioMovimentacao';
import { BotaoSair } from '../components/BotaoSair';

export function MovimentacoesScreen() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    setErro('');
    try {
      const [lista, opcoes] = await Promise.all([
        movimentacaoApi.listar(),
        produtoApi.listar(),
      ]);
      setMovimentacoes(lista);
      setProdutos(opcoes);
    } catch {
      setErro('Não foi possível carregar as movimentações e os produtos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Atualiza as opções e o estoque ao voltar para a tela.
  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <View>
        {carregando ? <Text>Carregando movimentações...</Text> : erro ? (
          <Text style={{ color: '#b91c1c' }}>{erro}</Text>
        ) : (
          <>
            <ListaMovimentacoes movimentacoes={movimentacoes} />
            <FormularioMovimentacao produtos={produtos} onMovimentacaoCriada={carregar} />
          </>
        )}
      </View>
    </ScrollView>
  );
}
