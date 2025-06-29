# Sistema de Gerenciamento de Clientes e Beneficiários

## Descrição
Sistema ASP.NET MVC para gerenciamento de clientes e seus beneficiários.

## Funcionalidades

### Clientes
- Cadastro de clientes com validação de dados
- Edição de informações do cliente
- Listagem de clientes cadastrados
- Máscaras automáticas para CPF, CEP e telefone

### Beneficiários
- Gerenciamento de beneficiários por cliente
- Edição inline de dados dos beneficiários
- Validação de CPF único por beneficiário
- Máscaras automáticas para CPF

## Estrutura do Projeto

### Scripts JavaScript

#### `/Scripts/mascaras.js`
Biblioteca principal para aplicação de máscaras automáticas:
- Aplicação automática na carga da página
- Máscaras durante a digitação
- Observer para campos dinâmicos
- Suporte para CPF, CEP e telefone

#### `/Scripts/utils.js`
Funções utilitárias comuns:
- `ModalDialog()` - Exibição de modais

#### `/Scripts/Clientes/`
- `FI.Clientes.js` - Lógica do formulário de inclusão
- `FI.AltClientes.js` - Lógica do formulário de edição
- `FI.ListClientes.js` - Lógica da listagem
- `FI.ClienteForm.js` - Lógica do formulário principal

#### `/Scripts/Beneficiarios/`
- `FI.Beneficiarios.js` - Gerenciamento principal de beneficiários
- `FI.BeneficiariosEvents.js` - Eventos e interações de beneficiários

### Bundles Configurados

- `~/bundles/mascaras` - Biblioteca de máscaras
- `~/bundles/utils` - Funções utilitárias
- `~/bundles/clientes` - Scripts de clientes (incluindo formulário)
- `~/bundles/altClientes` - Scripts de alteração
- `~/bundles/listClientes` - Scripts de listagem
- `~/bundles/beneficiarios` - Scripts de beneficiários

## Máscaras Implementadas

### CPF
- Formato: `000.000.000-00`
- Aplicação automática na carga e digitação
- Limpeza automática no envio

### CEP
- Formato: `00000-000`
- Aplicação automática na carga e digitação
- Limpeza automática no envio

### Telefone
- Formato: `(00) 00000-0000` (11 dígitos) ou `(00) 0000-0000` (10 dígitos)
- Aplicação automática na carga e digitação
- Limpeza automática no envio

## Tecnologias Utilizadas

- ASP.NET MVC 5
- jQuery 3.4.1
- Bootstrap 3
- JTable para listagens
- JavaScript ES6+

## Boas Práticas Implementadas

- Separação de responsabilidades
- Código limpo sem logs desnecessários
- Organização em bundles
- Reutilização de código
- Fallbacks para compatibilidade
- Observer pattern para campos dinâmicos
- Organização de scripts por funcionalidade (Clientes/Beneficiarios) 
