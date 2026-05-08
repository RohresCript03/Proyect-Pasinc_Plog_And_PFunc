% ─── HECHOS: Contratos ────────────────────────────────────────────────────────
contrato(contrato1, activo, 2020, cliente_a).
contrato(contrato2, vencido, 2019, cliente_b).
contrato(contrato3, activo, 2022, cliente_c).
contrato(contrato4, suspendido, 2021, cliente_d).
contrato(contrato5, activo, 2023, cliente_e).

% ─── HECHOS: Pagos pendientes ─────────────────────────────────────────────────
pago_pendiente(contrato1, 5000).
pago_pendiente(contrato2, 12000).
pago_pendiente(contrato4, 3000).

% ─── HECHOS: Tipo de cliente ──────────────────────────────────────────────────
tipo_cliente(cliente_a, premium).
tipo_cliente(cliente_b, estandar).
tipo_cliente(cliente_c, premium).
tipo_cliente(cliente_d, estandar).
tipo_cliente(cliente_e, estandar).

% ─── REGLAS: Inferencia lógica ───────────────────────────────────────────────

% Un contrato es de alto riesgo si está vencido o suspendido
alto_riesgo(Contrato) :-
    contrato(Contrato, vencido, _, _).
alto_riesgo(Contrato) :-
    contrato(Contrato, suspendido, _, _).

% Aplica penalización si hay pago pendiente > 4000
penalizacion_aplicable(Contrato) :-
    pago_pendiente(Contrato, Monto),
    Monto > 4000.

% Contrato problemático: alto riesgo Y penalización
contrato_problematico(Contrato) :-
    alto_riesgo(Contrato),
    penalizacion_aplicable(Contrato).

% Necesita auditoría: contrato activo con cliente estándar
necesita_auditoria(Contrato) :-
    contrato(Contrato, activo, _, Cliente),
    tipo_cliente(Cliente, estandar).

% Elegible para renovación: activo, premium, sin pago pendiente
elegible_renovacion(Contrato) :-
    contrato(Contrato, activo, _, Cliente),
    tipo_cliente(Cliente, premium),
    \+ pago_pendiente(Contrato, _).

% Información completa de un contrato
info_contrato(Contrato, Estado, Ano, Cliente, Tipo) :-
    contrato(Contrato, Estado, Ano, Cliente),
    tipo_cliente(Cliente, Tipo).