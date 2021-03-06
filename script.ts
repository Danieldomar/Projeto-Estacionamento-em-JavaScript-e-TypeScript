interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date|string;

}

(function(){
    const $ = (query: string): HTMLInputElement | null => 
        document.querySelector(query);

        function calcTempo( mil: number){

            const min = Math.floor(mil / 60000);
            const sec = Math.floor(mil % 60000);

            return  `${min}m e ${sec}s`;
        }

    function patio() {
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) :[];
        }

        function adcionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">x</button>
                </td>
                `;
                row.querySelector(".delete") ?.addEventListener("click", function(){
                    remover(this.dataset.placa)
                })

                $("#patio")?.appendChild(row);
                if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string){
            const {entrada, nome}= ler().find(veiculo => veiculo.placa);

            const tempo = calcTempo(new Date().getTime() - new Date( entrada).getTime());

            if(!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }

        function salvar(veiculo: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }

        function render(){
            $("#patio")!.innerHTML ="";
            const patio = ler();

            if (patio.length){
                patio.forEach((veiculo) => adcionar(veiculo));
            }
        }

        return {ler, adcionar, remover, salvar, render };

    }
    patio().render();
    $("#cadastrar")?.addEventListener("click",()=> {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        
    if(!nome || !placa) {
        alert("Os campos nome e placa são obrigatórios!");
        return;
    }
    patio().adcionar({nome, placa, entrada: new Date().toISOString() }, true);
});
})();


