package io.bootify.helisys.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductViewDTO {

    private Integer proId;
    private String proNumeroParte;
    private String proNombre;
    private String proNumeroParteAlterno;
    private String proNumeroSerie;
    private Integer proUnidades;
    private String proTipoDocumento;
    private String tpoNombreTipo;
    private String contenedorCombinado;
    private String mreNombre;
    private String pveNombre;


    public ProductViewDTO(Integer proId, String proNumeroParte, String proNombre,
                          String proNumeroParteAlterno, String proNumeroSerie,
                          Integer proUnidades,
                          String proTipoDocumento, String tipoProducto,
                          String contenedorCombinado, String modeloAeronave,
                          String proveedor) {
        this.proId = proId;
        this.proNumeroParte = proNumeroParte;
        this.proNombre = proNombre;
        this.proNumeroParteAlterno = proNumeroParteAlterno;
        this.proNumeroSerie = proNumeroSerie;
        this.proUnidades = proUnidades;
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

