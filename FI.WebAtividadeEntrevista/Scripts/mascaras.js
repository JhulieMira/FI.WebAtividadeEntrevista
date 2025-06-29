// BIBLIOTECA DE MÁSCARAS AUTOMÁTICAS
// Aplica máscaras automaticamente quando a página carrega e durante a digitação

(function() {
    'use strict';
    
    const MASCARAS = {
        CPF: {
            pattern: /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            format: '$1.$2.$3-$4',
            maxLength: 14,
            placeholder: '000.000.000-00'
        },
        CEP: {
            pattern: /^(\d{5})(\d{3})$/,
            format: '$1-$2',
            maxLength: 9,
            placeholder: '00000-000'
        },
        TELEFONE: {
            pattern10: /^(\d{2})(\d{4})(\d{4})$/,
            pattern11: /^(\d{2})(\d{5})(\d{4})$/,
            format10: '($1) $2-$3',
            format11: '($1) $2-$3',
            maxLength: 15,
            placeholder: '(00) 00000-0000'
        }
    };
    
    function aplicarMascaraCPF(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        input.value = value;
    }
    
    function aplicarMascaraCEP(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        input.value = value;
    }
    
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
    
    function formatarCPF(valor) {
        if (!valor) return '';
        let value = valor.replace(/\D/g, '');
        if (value.length === 11) {
            return value.replace(MASCARAS.CPF.pattern, MASCARAS.CPF.format);
        }
        return valor;
    }
    
    function formatarCEP(valor) {
        if (!valor) return '';
        let value = valor.replace(/\D/g, '');
        if (value.length === 8) {
            return value.replace(MASCARAS.CEP.pattern, MASCARAS.CEP.format);
        }
        return valor;
    }
    
    function formatarTelefone(valor) {
        if (!valor) return '';
        let value = valor.replace(/\D/g, '');
        if (value.length === 11) {
            return value.replace(MASCARAS.TELEFONE.pattern11, MASCARAS.TELEFONE.format11);
        } else if (value.length === 10) {
            return value.replace(MASCARAS.TELEFONE.pattern10, MASCARAS.TELEFONE.format10);
        }
        return valor;
    }
    
    function configurarMascaraCampo(campo, tipo) {
        if (!campo) return;
        
        if (campo.value) {
            switch (tipo) {
                case 'CPF':
                    campo.value = formatarCPF(campo.value);
                    break;
                case 'CEP':
                    campo.value = formatarCEP(campo.value);
                    break;
                case 'TELEFONE':
                    campo.value = formatarTelefone(campo.value);
                    break;
            }
        }
        
        campo.addEventListener('input', function() {
            switch (tipo) {
                case 'CPF':
                    aplicarMascaraCPF(this);
                    break;
                case 'CEP':
                    aplicarMascaraCEP(this);
                    break;
                case 'TELEFONE':
                    aplicarMascaraTelefone(this);
                    break;
            }
        });
    }
    
    function configurarTodasMascaras() {
        configurarMascaraCampo(document.getElementById('CPF'), 'CPF');
        configurarMascaraCampo(document.getElementById('BeneficiarioCPF'), 'CPF');
        configurarMascaraCampo(document.getElementById('CEP'), 'CEP');
        configurarMascaraCampo(document.getElementById('Telefone'), 'TELEFONE');
        
        document.querySelectorAll('.input-edit-cpf').forEach(function(campo) {
            configurarMascaraCampo(campo, 'CPF');
        });
        
        document.querySelectorAll('[data-mask]').forEach(function(campo) {
            const tipo = campo.getAttribute('data-mask').toUpperCase();
            configurarMascaraCampo(campo, tipo);
        });
    }
    
    function aplicarMascarasDinamicas() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const camposCPF = node.querySelectorAll ? node.querySelectorAll('#CPF, #BeneficiarioCPF, .input-edit-cpf') : [];
                        const camposCEP = node.querySelectorAll ? node.querySelectorAll('#CEP') : [];
                        const camposTelefone = node.querySelectorAll ? node.querySelectorAll('#Telefone') : [];
                        
                        camposCPF.forEach(function(campo) {
                            if (!campo._mascaraConfigurada) {
                                configurarMascaraCampo(campo, 'CPF');
                                campo._mascaraConfigurada = true;
                            }
                        });
                        
                        camposCEP.forEach(function(campo) {
                            if (!campo._mascaraConfigurada) {
                                configurarMascaraCampo(campo, 'CEP');
                                campo._mascaraConfigurada = true;
                            }
                        });
                        
                        camposTelefone.forEach(function(campo) {
                            if (!campo._mascaraConfigurada) {
                                configurarMascaraCampo(campo, 'TELEFONE');
                                campo._mascaraConfigurada = true;
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function limparMascara(valor) {
        return valor ? valor.replace(/\D/g, '') : '';
    }
    
    window.Mascaras = {
        configurar: configurarTodasMascaras,
        configurarCampo: configurarMascaraCampo,
        formatarCPF: formatarCPF,
        formatarCEP: formatarCEP,
        formatarTelefone: formatarTelefone,
        limpar: limparMascara,
        aplicarDinamicas: aplicarMascarasDinamicas
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            configurarTodasMascaras();
            aplicarMascarasDinamicas();
        });
    } else {
        configurarTodasMascaras();
        aplicarMascarasDinamicas();
    }
    
    if (typeof $ !== 'undefined') {
        $(document).ready(function() {
            configurarTodasMascaras();
            aplicarMascarasDinamicas();
        });
    }
    
    setTimeout(function() {
        configurarTodasMascaras();
    }, 1000);
    
})(); 