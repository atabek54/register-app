/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';

import {
  LineChart,
  ProgressChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import {useUser} from '../context/user_context';

const Home = ({navigation}: {navigation: any}) => {
  const tableHead = ['Head', 'Head2', 'Head3', 'Head4'];
  const tableData = [
    ['1', '2', '3', '4'],
    ['a', 'b', 'c', 'd'],
    ['1', '2', '3', '456'],
    ['a', 'b', 'c', 'd'],
  ];

  const {user} = useUser();
  const screenWidth = Dimensions.get('screen').width;
  const data = {
    labels: ['Swim', 'Bike', 'Run'], // optional
    data: [0.4, 0.6, 0.8],
  };
  const data2 = {
    labels: ['Test1', 'Test2'],
    legend: ['L1', 'L2', 'L3'],
    data: [
      [60, 60, 60],
      [30, 30, 60],
    ],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
  };
  const progressChartConfig = {
    backgroundGradientFrom: '#E7F5FF',
    backgroundGradientTo: '#E7F5FF',
    decimalPlaces: 0,
    color: (opacity = 0.9) => `rgba(250, 125, 130, ${opacity})`,
    style: {
      borderRadius: 19,
    },
    barPercentage: 0.9, // Bar genişliği
    useShadowColorFromDataset: false, // Shadow rengi kullanımı
  };
  const topCardList = [
    {id: '1', info: 'Sağlık'},
    {id: '2', info: 'Finans'},
    {id: '3', info: 'Seyahat'},
    // Diğer bilgiler buraya eklenebilir
  ];

  // Her bir kartı render eden fonksiyon
  const renderItem = ({item}: {item: {id: string; info: string}}) => (
    <View style={[styles.card, {backgroundColor: getRandomColor()}]}>
      <Text style={styles.infoText}>{item.info}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={topCardList}
          renderItem={renderItem}
          keyExtractor={(item: any) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        />
        <View style={{...styles.chartContainer}}>
          <Text style={styles.chartTitle}>İlgi Alanları</Text>

          <ProgressChart
            data={data}
            width={screenWidth}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={progressChartConfig}
            hideLegend={false}
          />
          <Text style={styles.chartTitle}>Aylık Giderler</Text>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: Array.from({length: 6}, () => Math.random() * 100),
                },
              ],
            }}
            width={Dimensions.get('window').width - 20}
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </View>
      <View style={styles.tablecontainer}>
        <Text style={styles.chartTitle}>Table Component</Text>

        <Table style={styles.table}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16); // Rastgele hexadecimal renk üretir
};
const chartConfig = {
  backgroundColor: '#437a65',
  backgroundGradientFrom: '#437a65',
  backgroundGradientTo: '#469376',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {borderRadius: 16},
  propsForDots: {r: '6', strokeWidth: '2', stroke: '#ffa726'},
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Metni yatayda ortala
  },
  card: {
    width: Dimensions.get('window').width * 0.4, // Ekran genişliğinin %40'ı kadar genişlik
    height: 55,
    borderRadius: 10,
    backgroundColor: 'lightgray',
    marginHorizontal: 10, // Kartlar arası boşluk
    justifyContent: 'center', // Dikeyde ortala
    alignItems: 'center', // Yatayda ortala
  },
  scrollContainer: {
    alignItems: 'center', // Kartların dikey hizalaması için
    paddingVertical: 10,
  },

  tablecontainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: Dimensions.get('window').width, // Ekran genişliğine eşit olacak şekilde ayarlandı
  },
  tableWrapper: {
    marginLeft: 10, // Add margin to push the table content to the right
  },
  head: {height: 40, backgroundColor: 'transparent', fontWeight: '700'},
  text: {margin: 6, fontWeight: 'bold'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 50,
  },

  table: {
    borderWidth: 0,
    borderColor: '#c8e1ff',
    borderRadius: 10,
    backgroundColor: '#C2C2FF', // Table background color
  },

  headText: {
    margin: 6,
    fontWeight: 'bold',
    color: '#000000', // Head text color
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E7F5FF',
  },
  chartContainer: {
    margin: 0,
    borderRadius: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontWeight: '600',
    color: 'black',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 20,
  },
  bottomSpace: {
    paddingBottom: 70, // Alt boşluğun yüksekliği
  },
});

export default Home;
