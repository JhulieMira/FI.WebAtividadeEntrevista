
$(document).ready(function () {

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true, //Enable paging
            pageSize: 5, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'Nome ASC', //Set default sorting
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Nome: {
                    title: 'Nome',
                    width: '50%'
                },
                Email: {
                    title: 'Email',
                    width: '35%'
                },
                Alterar: {
                    title: '',
                    display: function (data) {
                        return '<button onclick="window.location.href=\'' + urlAlteracao + '/' + data.record.Id + '\'" class="btn btn-primary btn-sm">Alterar</button>';
                    }
                }
            }
        });

    //Load student list from server
    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable('load');
});

    $(document).ready(function () {
        // Função para aplicar máscara de CPF
        function aplicarMascaraCPF(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            input.value = value;
        }

        // Função para aplicar máscara de CEP
        function aplicarMascaraCEP(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            input.value = value;
        }

        // Função para aplicar máscara de telefone
        function aplicarMascaraTelefone(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                if (value.length > 10) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
            }
            input.value = value;
        }

        // Aplicar máscaras aos campos
        $('#CPF').on('input', function () {
            aplicarMascaraCPF(this);
        });

        $('#CEP').on('input', function () {
            aplicarMascaraCEP(this);
        });

        $('#Telefone').on('input', function () {
            aplicarMascaraTelefone(this);
        });

        // Remover máscaras antes do envio do formulário para manter dados limpos
        $('#formCadastro').on('submit', function () {
            // Remover máscaras dos campos antes do envio
            var cpfValue = $('#CPF').val().replace(/[^\d]/g, '');
            var cepValue = $('#CEP').val().replace(/[^\d]/g, '');
            var telefoneValue = $('#Telefone').val().replace(/[^\d]/g, '');

            // Criar campos temporários com valores limpos
            $('<input>').attr({
                type: 'hidden',
                name: 'CPF',
                value: cpfValue
            }).appendTo('#formCadastro');

            $('<input>').attr({
                type: 'hidden',
                name: 'CEP',
                value: cepValue
            }).appendTo('#formCadastro');

            $('<input>').attr({
                type: 'hidden',
                name: 'Telefone',
                value: telefoneValue
            }).appendTo('#formCadastro');

            // Desabilitar os campos originais para não enviar valores com máscara
            $('#CPF').prop('disabled', true);
            $('#CEP').prop('disabled', true);
            $('#Telefone').prop('disabled', true);
        });
    });
