export class ChartData {

    public data: { category: string; total: number }[] = [];

    // Método para adicionar uma categoria nos dados do gráfico
    addCategory ( category: string, total: number ){

        // Primeiro tenta verificar se existe esta categoria
        const existingEntry = this.data.find(
            entry => entry.category === category
        );

        // Se existir, só atualiza o valor 
        if (existingEntry) {
            existingEntry.total += total; 
        } else {

            // Se não tiver, cria a  nova categoria
            this.data.push({
                category: category,
                total: total,
            });
        }
    }

    // Método pra adicionar uma entrada na matriz
    addChartData (chartData : ChartData) {
        for (const entry of chartData.data) {
            this.addCategory(entry.category, entry.total);
        }
    }

}