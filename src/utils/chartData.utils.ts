export class ChartData {

    public data: { x: string; y: number }[] = [];

    // Método para adicionar uma categoria nos dados do gráfico
    addCategory ( category: string, total: number ){

        // Primeiro tenta verificar se existe esta categoria
        const existingEntry = this.data.find(
            entry => entry.x === category
        );

        // Se existir, só atualiza o valor 
        if (existingEntry) {
            existingEntry.y += total; 
        } else {

            // Se não tiver, cria a  nova categoria
            this.data.push({
                x: category,
                y: total,
            });
        }
    }

    // Método pra adicionar uma entrada na matriz
    addChartData (chartData : ChartData) {
        for (const entry of chartData.data) {
            this.addCategory(entry.x, entry.y);
        }
    }

}