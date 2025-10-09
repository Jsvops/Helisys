package io.bootify.helisys.util;

public class InsufficientStockException extends RuntimeException {
    private final int disponible;
    private final int solicitado;

    public InsufficientStockException(int disponible, int solicitado) {
        super("No hay suficiente stock para realizar la baja. Disponible: " + disponible + ", Solicitado: " + solicitado);
        this.disponible = disponible;
        this.solicitado = solicitado;
    }

    public int getDisponible() { return disponible; }
    public int getSolicitado() { return solicitado; }
}
