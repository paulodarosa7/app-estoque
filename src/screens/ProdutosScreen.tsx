import { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Categoria, Produto } from '../types';
import { categoriaApi, produtoApi } from '../api/api';
import { ListaProdutos } from '../components/ListaProdutos';
import { FormularioProduto } from '../components/FormularioProduto';
import { BotaoSair } from '../components/BotaoSair';

export function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    setErro('');
    try {
      const [lista, opcoes] = await Promise.all([
        produtoApi.listar(),
        categoriaApi.listar(),
      ]);
      setProdutos(lista);
      setCategorias(opcoes);
    } catch {
      setErro('Não foi possível carregar os produtos e as categorias.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega também ao voltar de Categorias ou Movimentações.
  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <View>
        {carregando ? <Text>Carregando produtos...</Text> : erro ? (
          <Text style={{ color: '#b91c1c' }}>{erro}</Text>
        ) : (
          <>
            <ListaProdutos produtos={produtos} />
            <FormularioProduto categorias={categorias} onProdutoCriado={carregar} />
          </>
        )}
      </View>
    </ScrollView>
  );
}
