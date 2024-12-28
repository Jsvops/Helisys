package io.bootify.helisys.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class ProductViewDTO {

    // Getters y Setters
    @Setter
    @Getter
    private Integer proId; // Corresponde a p.id
    @Setter
    @Getter
    private String proNumeroParte;
    @Setter
    @Getter
    private String proNombre;
    @Setter
    @Getter
    private String proNumeroParteAlterno;
    @Setter
    @Getter
    private String proNumeroSerie;
    @Setter
    @Getter
    private Integer proUnidades;
    @Setter
    @Getter
    private LocalDate proFechaVencimiento;
    @Setter
    @Getter
    private String proTipoDocumento;
    // cambio de valor
    private String tpoNombreTipo; // tpo.tpoNombre
    @Setter
    @Getter
    private String contenedorCombinado; // CONCAT(amt.amtDescripcion, amr.amrNombre, amc.amcNumero)
    private String mreNombre; // mre.mreNombre
    private String pveNombre; // pve.pveNombre

    // Constructor con parámetros
    public ProductViewDTO(Integer proId, String proNumeroParte, String proNombre,
                          String proNumeroParteAlterno, String proNumeroSerie,
                          Integer proUnidades, LocalDate proFechaVencimiento,
                          String proTipoDocumento, String tipoProducto,
                          String contenedorCombinado, String modeloAeronave,
                          String proveedor) {
        this.proId = proId;
        this.proNumeroParte = proNumeroParte;
        this.proNombre = proNombre;
        this.proNumeroParteAlterno = proNumeroParteAlterno;
        this.proNumeroSerie = proNumeroSerie;
        this.proUnidades = proUnidades;
        this.proFechaVencimiento = proFechaVencimiento;
        this.proTipoDocumento = proTipoDocumento;
        this.tpoNombreTipo = tipoProducto;
        this.contenedorCombinado = contenedorCombinado;
        this.mreNombre = modeloAeronave;
        this.pveNombre = proveedor;
    }

    public String getTipoProducto() {
        return tpoNombreTipo;
    }

    public void setTipoProducto(String tipoProducto) {
        this.tpoNombreTipo = tipoProducto;
    }

    public String getModeloAeronave() {
        return mreNombre;
    }

    public void setModeloAeronave(String modeloAeronave) {
        this.mreNombre = modeloAeronave;
    }

    public String getProveedor() {
        return pveNombre;
    }

    public void setProveedor(String proveedor) {
        this.pveNombre = proveedor;
    }
}

