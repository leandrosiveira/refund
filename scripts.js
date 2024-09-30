// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")

//querySelector aprofundando nas tags identadas
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  //console.log("Novo conteúdo!")
  // Obtém o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")
  //console.log(value)

  // Transforma o valor em centavos (exemplo: 150/100 = 1.5, que é equivalente a R$1,50).
  value = Number(value / 100)

  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro).
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}
// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
// previne o comportamento padrão de recarregar a página
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  //Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense)
}
// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na Lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}` // é preciso remover o R$ pq já foi incluso na formatação acima, formatCurrencyBRL

    // Cria o ícone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

     // Adiciona as informações no item.
     expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Aciciona o item na lista.
    expenseList.append(expenseItem)

    // Limpa o formulario para adicionar um novo item.
    formClear()

    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    
    // atualiza a quantidade de itens da lista.
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar o total.
    let total = 0

    // Percorre cada item (li) da lista (ul)
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount")

      // limpando tudo que não é numero com uma expressão regular e trocando virgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

      // Converte o valor para float.
      value = parseFloat(value)

      //Verifica se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o tota. O valor não parece ser um número."
        )
      }

      // Incrementar o valor total.
      total += Number(value)
    }

    // Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$","")

    // Limpa o conteúdo do elemento.
    expensesTotal.innerHTML = ""
    
    // adiciona o RS formatado pela small e o valor formatado
    expensesTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
  // Verifica se o elemento clicado é o ícone de remover.
  // O target é o local onde clicou ou interagiu.
  if(event.target.classList.contains("remove-icon")){ // se o conteudo da classe d alista tiver o "remove-icon"
  // closest é o pai mais próximo
    const item = event.target.closest(".expense")

    // Remove item da lista.
    item.remove()
  }

  //Atualiza os totais.
  updateTotals()
})

function formClear(){
  // Limpa ps inputs.
  expense.value = ""
  category.value = ""
  amount.value = ""

  // coloca o foco no input de amount, não precisando usar o mouse.
  expense.focus()
}