package io.bootify.helisys.model;

public class AlmacenCombinadoDTO {
    private Integer amcId;
    private String descripcionCombinada;

    // Constructor
    public AlmacenCombinadoDTO(Integer amcId, String descripcionCombinada) {
        this.amcId = amcId;
        this.descripcionCombinada = descripcionCombinada;
    }

    // Getters y Setters
    public Integer getAmcId() {
        return amcId;
    }

    public void setAmcId(Integer amcId) {
        this.amcId = amcId;
    }

    public String getDescripcionCombinada() {
        return descripcionCombinada;
    }

    public void setDescripcionCombinada(String descripcionCombinada) {
        this.descripcionCombinada = descripcionCombinada;
    }
}
